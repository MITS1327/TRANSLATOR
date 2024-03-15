import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Stream, Transform } from 'stream';
import { IsolationLevel, Transactional } from 'typeorm-transactional';

import {
  BaseOutgoingEventService,
  KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER,
  OutgoingEventTypeEnum,
} from '@translator/messaging';

import { CREATION_TRANSLATOR_DATA_KEY_LOCK, GetDataWithFilterOutputObject } from '@translator/shared';

import { IN_MEMORY_STORAGE_SERVICE_PROVIDER, InMemoryStorageService } from '@translator/infrastructure';

import { LANG_REPOSITORY_PROVIDER, LangRepository } from '../lang';
import { PROJECT_REPOSITORY_PROVIDER, ProjectEntity, ProjectRepository } from '../project';
import { JSON_MIME_TYPE } from './constants';
import { CreateKeyKafkaEvent, UpdateKeyKafkaEvent } from './events';
import {
  ConstructTranslatedKeyInputObject,
  CreateKeyInputObject,
  ExportToJSONInputObject,
  GetKeysWithFilterInputObject,
  UpdateKeyInputObject,
  UpdateTranslatedKeyInputObject,
} from './input-objects';
import { KeyService, TranslatedKeyEntity, TranslatedKeyRepository } from './interfaces';
import { TRANSLATED_KEY_REPOSITORY_PROVIDER } from './key.di-tokens';
import { GroupedTranslatedKeysByLangName, KeyDataForCreate } from './types';

@Injectable()
export class KeyServiceImpl implements KeyService {
  constructor(
    @Inject(TRANSLATED_KEY_REPOSITORY_PROVIDER) private readonly translatedKeyRepository: TranslatedKeyRepository,
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
    @Inject(KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER) private readonly outgoingEventService: BaseOutgoingEventService,
    @Inject(IN_MEMORY_STORAGE_SERVICE_PROVIDER) private readonly inMemoryStorageService: InMemoryStorageService,
  ) {}

  private readonly MAX_LOG_COUNT = 10;

  async getTranslatedKeys(
    data: GetKeysWithFilterInputObject,
  ): Promise<GetDataWithFilterOutputObject<TranslatedKeyEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.translatedKeyRepository.filterBuilder(filter);

    return this.translatedKeyRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  //TODO: bool to enum
  async getProjectOrThrow(projectId: ProjectEntity['id'], withLock = false): Promise<ProjectEntity> {
    const project = withLock
      ? await this.projectRepository.getOneByIdAndLock(projectId)
      : await this.projectRepository.getOneById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  constructTranslatedKeyData(data: ConstructTranslatedKeyInputObject): Omit<TranslatedKeyEntity, 'id'> {
    const keyValue = data.isTranslatableLang ? data.value : data.name;

    return {
      name: data.name,
      projectId: data.projectId,
      value: keyValue,
      langId: data.langId,
      logs: [
        {
          newValue: keyValue,
          oldValue: '',
          userId: data.userId,
          timestamp: data.timestamp,
        },
      ],
      createdAt: data.timestamp,
      updatedAt: data.timestamp,
      comment: data.comment,
    };
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createKey(data: CreateKeyInputObject): Promise<void> {
    await this.inMemoryStorageService.isHaveLockOrThrow(CREATION_TRANSLATOR_DATA_KEY_LOCK);

    const project = await this.getProjectOrThrow(data.projectId, true);
    const timestamp = new Date();
    const langs = await this.langRepository.getAll();
    const valuesObject =
      data.values?.reduce(
        (acc, value) => ({
          ...acc,
          [value.langId]: value.value,
        }),
        {},
      ) || {};

    const keys: KeyDataForCreate[] = langs.map((lang) => {
      const translatedKeyData = this.constructTranslatedKeyData({
        name: data.name,
        projectId: data.projectId,
        langId: lang.id,
        userId: data.userId,
        comment: data.comment,
        value: valuesObject[lang.id] || data.name,
        timestamp,
        isTranslatableLang: lang.isTranslatable,
      });

      return {
        ...translatedKeyData,
        langName: lang.name,
      };
    });

    await this.outgoingEventService.emitFromPersist(
      new CreateKeyKafkaEvent(OutgoingEventTypeEnum.EXTERNAL, {
        keyName: data.name,
        projectId: data.projectId,
        values: keys.map((key) => ({
          langName: key.langName,
          value: key.value,
        })),
      }),
    );
    await this.projectRepository.updateOneById(data.projectId, { keysCount: project.keysCount + 1 });
    await this.translatedKeyRepository.createBulk(keys);
  }

  async getTranslatedKeysGroupedByLangName(projectId: ProjectEntity['id']): Promise<GroupedTranslatedKeysByLangName> {
    await this.getProjectOrThrow(projectId, false);

    const langs = await this.langRepository.getAll();
    const keyObjectArray = await Promise.all(
      langs.map(async (lang) => {
        const keys = await this.translatedKeyRepository.getManyBy({ projectId, langId: lang.id });

        return {
          [lang.name]: keys.reduce((acc, key) => ({ ...acc, [key.name]: key.value }), {}),
        } as unknown as GroupedTranslatedKeysByLangName;
      }),
    );

    return keyObjectArray.reduce(
      (acc, keyObject) => ({
        ...acc,
        ...keyObject,
      }),
      {},
    );
  }

  private async getTranslatedKeyByIdWithLockOrThrow(id: TranslatedKeyEntity['id']): Promise<TranslatedKeyEntity> {
    const key = await this.translatedKeyRepository.getOneByIdAndLock(id);
    if (!key) {
      throw new NotFoundException('Translated key not found');
    }

    return key;
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async updateKey(data: UpdateKeyInputObject): Promise<void> {
    const translatedKeysCount = await this.translatedKeyRepository.getCountBy({
      projectId: data.projectId,
      name: data.name,
    });
    if (!translatedKeysCount) {
      throw new NotFoundException('Keys with entered name not found');
    }

    await this.translatedKeyRepository.updateManyByWithoutCheck(
      { projectId: data.projectId, name: data.name },
      {
        comment: data.comment,
        updatedAt: new Date(),
      },
    );
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async updateKeyTranslate(data: UpdateTranslatedKeyInputObject): Promise<void> {
    const key = await this.getTranslatedKeyByIdWithLockOrThrow(data.id);
    const lang = await this.langRepository.getOneById(key.langId);
    const timestamp = new Date();

    if (!lang.isTranslatable) {
      throw new ConflictException('This language is not translatable');
    }

    await this.translatedKeyRepository.updateOneById(data.id, {
      ...data,
      logs: [
        {
          newValue: data.value,
          oldValue: key.value,
          userId: data.userId,
          timestamp,
        },
        ...(key.logs.slice(0, this.MAX_LOG_COUNT - 1) || []),
      ],
      updatedAt: timestamp,
    });

    await this.outgoingEventService.emitFromPersist(
      new UpdateKeyKafkaEvent(OutgoingEventTypeEnum.EXTERNAL, {
        keyName: key.name,
        langName: lang.name,
        keyValue: data.value,
        projectId: key.projectId,
      }),
    );
  }

  async exportToJSON(inputObject: ExportToJSONInputObject): Promise<{ mimeType: string; stream: Stream }> {
    const stream = await this.translatedKeyRepository.getAllByLangIdAndProjectIdStream(
      inputObject.projectId,
      inputObject.langId,
    );
    let isStreamWritten = false;
    const tranformStreamToValidArray = new Transform({
      transform: (chunk, _encoding, callback) => {
        if (!isStreamWritten) {
          isStreamWritten = true;

          return callback(null, '[' + JSON.stringify(chunk));
        }

        return callback(null, ',' + JSON.stringify(chunk));
      },
      flush(callback) {
        callback(null, ']');
      },
      objectMode: true,
    });

    return {
      mimeType: JSON_MIME_TYPE,
      stream: stream.pipe(tranformStreamToValidArray),
    };
  }
}
