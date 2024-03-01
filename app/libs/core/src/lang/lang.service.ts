import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';

import { Transform } from 'stream';
import { IsolationLevel, Transactional } from 'typeorm-transactional';

import {
  BaseOutgoingEventService,
  KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER,
  OutgoingEventTypeEnum,
} from '@translator/messaging';

import { concatStream, CREATION_TRANSLATOR_DATA_KEY_LOCK, GetDataWithFilterOutputObject } from '@translator/shared';

import { IN_MEMORY_STORAGE_SERVICE_PROVIDER, InMemoryStorageService } from '@translator/infrastructure';

import {
  KEY_SERVICE_PROVIDER,
  KeyService,
  TRANSLATED_KEY_REPOSITORY_PROVIDER,
  TranslatedKeyRepository,
  UniqueKeyNamesByProject,
} from '../key';
import { CreateLangKafkaEvent } from './events';
import { CreateLangInputObject, GetLangsWithFilterInputObject, UpdateLangInputObject } from './input-objects';
import { LangEntity, LangRepository, LangService } from './interfaces';
import { LANG_REPOSITORY_PROVIDER } from './lang.di-tokens';

@Injectable()
export class LangServiceImpl implements LangService {
  constructor(
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER) private readonly outgoingEventService: BaseOutgoingEventService,
    @Inject(IN_MEMORY_STORAGE_SERVICE_PROVIDER) private readonly inMemoryStorageService: InMemoryStorageService,
    @Inject(forwardRef(() => TRANSLATED_KEY_REPOSITORY_PROVIDER))
    private readonly translatedKeyRepository: TranslatedKeyRepository,
    @Inject(forwardRef(() => KEY_SERVICE_PROVIDER)) private readonly keyService: KeyService,
  ) {}

  async getLangs(data: GetLangsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<LangEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.langRepository.filterBuilder(filter);

    return this.langRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  @Transactional({
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
  })
  async createLang(data: CreateLangInputObject): Promise<void> {
    const existLangCount = await this.langRepository.countBy({
      name: data.name,
    });

    if (existLangCount) {
      throw new ConflictException('Lang already exist');
    }

    await this.inMemoryStorageService.wrapInLock(CREATION_TRANSLATOR_DATA_KEY_LOCK, async () => {
      const newLangId = await this.langRepository.getNextLangId();
      const keys = await this.translatedKeyRepository.getAllUniqueKeyNamesByProjectStream();
      const timestamp = new Date();

      const translatedKeys = await concatStream(
        keys.pipe(
          new Transform({
            objectMode: true,
            transform: (chunk: UniqueKeyNamesByProject, _encoding, callback) => {
              callback(
                null,
                this.keyService.constructTranslatedKeyData({
                  name: chunk.name,
                  projectId: chunk.project_id,
                  comment: chunk.comment,
                  timestamp,
                  langId: newLangId,
                  value: chunk.name,
                  userId: data.userId,
                }),
              );
            },
          }),
        ),
      );

      await this.langRepository.createFromPlainObject({
        ...data,
        id: newLangId,
      });

      await this.translatedKeyRepository.createChunkedBulk(translatedKeys);

      await this.outgoingEventService.emitFromPersist(
        new CreateLangKafkaEvent(OutgoingEventTypeEnum.EXTERNAL, {
          langName: data.name,
          isTranslatable: data.isTranslatable,
        }),
      );
    });
  }

  async updateLang(data: UpdateLangInputObject): Promise<void> {
    await this.langRepository.updateOneById(data.id, data);
  }
}
