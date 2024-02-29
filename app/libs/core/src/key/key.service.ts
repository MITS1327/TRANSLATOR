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
import { CreateKeyInputObject, GetKeysWithFilterInputObject, UpdateKeyInputObject } from './input-objects';
import { KeyEntity, KeyRepository, KeyService } from './interfaces';
import { KEY_REPOSITORY_PROVIDER } from './key.di-tokens';
import { GroupedKeysByLangName, KeyDataForCreate } from './types';

@Injectable()
export class KeyServiceImpl implements KeyService {
  constructor(
    @Inject(KEY_REPOSITORY_PROVIDER) private readonly keyRepository: KeyRepository,
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
    @Inject(KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER) private readonly outgoingEventService: BaseOutgoingEventService,
  ) {}

  async getKeys(data: GetKeysWithFilterInputObject): Promise<GetDataWithFilterOutputObject<KeyEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.keyRepository.filterBuilder(filter);

    return this.keyRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  async getProjectOrThrow(projectId: ProjectEntity['id']): Promise<ProjectEntity> {
    const project = await this.projectRepository.getOneById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createKey(data: CreateKeyInputObject): Promise<void> {
    const project = await this.getProjectOrThrow(data.projectId);

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
      return {
        name: data.name,
        projectId: data.projectId,
        userId: data.userId,
        value: valuesObject[lang.id] || data.name,
        langId: lang.id,
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
    await this.keyRepository.createBulk(keys);
  }

  async getProjectKeysGroupedByLangName(projectId: ProjectEntity['id']): Promise<GroupedKeysByLangName> {
    await this.getProjectOrThrow(projectId);

    const langs = await this.langRepository.getAll();
    const keyObjectArray = await Promise.all(
      langs.map(async (lang) => {
        const keys = await this.keyRepository.getManyBy({ projectId, langId: lang.id });

        return {
          [lang.name]: keys.map((key) => ({ [key.name]: key.value })),
        } as unknown as GroupedKeysByLangName;
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

  async getKeyByIdOrThrow(id: KeyEntity['id']): Promise<KeyEntity> {
    const key = await this.keyRepository.getOneById(id);
    if (!key) {
      throw new NotFoundException('Key not found');
    }

    return key;
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async updateKey(data: UpdateKeyInputObject): Promise<void> {
    const key = await this.getKeyByIdOrThrow(data.id);
    const lang = await this.langRepository.getOneById(key.langId);

    await this.keyRepository.updateOneById(data.id, {
      ...data,
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
