import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IsolationLevel, Transactional } from 'typeorm-transactional';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { LANG_REPOSITORY_PROVIDER, LangRepository } from '../lang';
import { PROJECT_REPOSITORY_PROVIDER, ProjectEntity, ProjectRepository } from '../project';
import { CreateKeyInputObject, GetKeysWithFilterInputObject, UpdateKeyInputObject } from './input-objects';
import { KeyEntity, KeyRepository, KeyService } from './interfaces';
import { KEY_REPOSITORY_PROVIDER } from './key.di-tokens';
import { GroupedKeysByLangName } from './types';

@Injectable()
export class KeyServiceImpl implements KeyService {
  constructor(
    @Inject(KEY_REPOSITORY_PROVIDER) private readonly keyRepository: KeyRepository,
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
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

    const keys: Omit<KeyEntity, 'id' | 'createdAt' | 'updatedAt'>[] = langs.map((lang) => {
      return {
        name: data.name,
        projectId: data.projectId,
        userId: data.userId,
        value: valuesObject[lang.id] || data.name,
        langId: lang.id,
      };
    });

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

  async updateKey(data: UpdateKeyInputObject): Promise<void> {
    await this.keyRepository.updateOneById(data.id, {
      ...data,
      updatedAt: new Date(),
    });
  }
}
