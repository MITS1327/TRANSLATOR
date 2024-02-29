import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IsolationLevel, Transactional } from 'typeorm-transactional';

import {
  BaseOutgoingEventService,
  KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER,
  OutgoingEventTypeEnum,
} from '@translator/messaging';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { LANG_REPOSITORY_PROVIDER, LangRepository } from '../lang';
import { PROJECT_REPOSITORY_PROVIDER, ProjectEntity, ProjectRepository } from '../project';
import { CreateKeyKafkaEvent, UpdateKeyKafkaEvent } from './events';
import {
  CreateKeyInputObject,
  GetKeysWithFilterInputObject,
  UpdateKeyInputObject,
  UpdateTranslatedKeyInputObject,
} from './input-objects';
import { KeyService, TranslatedKeyEntity, TranslatedKeyRepository } from './interfaces';
import { KEY_REPOSITORY_PROVIDER } from './key.di-tokens';
import { GroupedTranslatedKeysByLangName, KeyDataForCreate } from './types';

@Injectable()
export class KeyServiceImpl implements KeyService {
  constructor(
    @Inject(KEY_REPOSITORY_PROVIDER) private readonly keyRepository: TranslatedKeyRepository,
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
    @Inject(KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER) private readonly outgoingEventService: BaseOutgoingEventService,
  ) {}

  async getTranslatedKeys(
    data: GetKeysWithFilterInputObject,
  ): Promise<GetDataWithFilterOutputObject<TranslatedKeyEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.keyRepository.filterBuilder(filter);

    return this.keyRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  async getProjectWithLockOrThrow(projectId: ProjectEntity['id']): Promise<ProjectEntity> {
    const project = await this.projectRepository.getOneByIdAndLock(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createKey(data: CreateKeyInputObject): Promise<void> {
    const project = await this.getProjectWithLockOrThrow(data.projectId);

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
      const keyValue = valuesObject[lang.id] || data.name;

      return {
        name: data.name,
        projectId: data.projectId,
        value: keyValue,
        langId: lang.id,
        langName: lang.name,
        logs: [
          {
            newValue: keyValue,
            oldValue: '',
            userId: data.userId,
          },
        ],
        comment: data.comment,
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
    await this.keyRepository.createBulk(keys);
  }

  async getTranslatedKeysGroupedByLangName(projectId: ProjectEntity['id']): Promise<GroupedTranslatedKeysByLangName> {
    await this.getProjectWithLockOrThrow(projectId);

    const langs = await this.langRepository.getAll();
    const keyObjectArray = await Promise.all(
      langs.map(async (lang) => {
        const keys = await this.keyRepository.getManyBy({ projectId, langId: lang.id });

        return {
          [lang.name]: keys.map((key) => ({ [key.name]: key.value })),
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
    const key = await this.keyRepository.getOneByIdAndLock(id);
    if (!key) {
      throw new NotFoundException('Key not found');
    }

    return key;
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async updateKey(data: UpdateKeyInputObject): Promise<void> {
    const translatedKeysCount = await this.keyRepository.getCountBy({ projectId: data.projectId, name: data.name });
    if (!translatedKeysCount) {
      throw new NotFoundException('Key not found');
    }

    await this.keyRepository.updateManyByWithoutCheck(
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

    await this.keyRepository.updateOneById(data.id, {
      ...data,
      logs: [
        {
          newValue: data.value,
          oldValue: key.value,
          userId: data.userId,
        },
        ...key.logs,
      ],
      updatedAt: new Date(),
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
}
