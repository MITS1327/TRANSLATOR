import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { createReadStream } from 'fs';
import { createInterface } from 'node:readline/promises';
import { Readable, Transform } from 'stream';
import { IsolationLevel, Transactional } from 'typeorm-transactional';

import { concatStream, CREATION_TRANSLATOR_DATA_KEY_LOCK, GetDataWithFilterOutputObject } from '@translator/shared';

import { IN_MEMORY_STORAGE_SERVICE_PROVIDER, InMemoryStorageService } from '@translator/infrastructure';

import {
  KEY_SERVICE_PROVIDER,
  KeyService,
  TRANSLATED_KEY_REPOSITORY_PROVIDER,
  TranslatedKeyEntity,
  TranslatedKeyRepository,
} from '../key';
import { LANG_REPOSITORY_PROVIDER, LangRepository } from '../lang';
import { CreateProjectInputObject, GetProjectsWithFilterInputObject, UpdateProjectInputObject } from './input-objects';
import { ProjectEntity, ProjectRepository, ProjectService } from './interfaces';
import { PROJECT_REPOSITORY_PROVIDER } from './project.di-tokens';
import { LangWithFile } from './types';

@Injectable()
export class ProjectServiceImpl implements ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
    @Inject(LANG_REPOSITORY_PROVIDER) private readonly langRepository: LangRepository,

    @Inject(forwardRef(() => KEY_SERVICE_PROVIDER)) private readonly keyService: KeyService,
    @Inject(forwardRef(() => TRANSLATED_KEY_REPOSITORY_PROVIDER))
    private readonly translatedKeyRepository: TranslatedKeyRepository,
    @Inject(IN_MEMORY_STORAGE_SERVICE_PROVIDER) private readonly inMemoryStorageService: InMemoryStorageService,
  ) {}

  async getProjects(data: GetProjectsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<ProjectEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.projectRepository.filterBuilder(filter);

    return this.projectRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  private async parsePootleFile(keys: Record<string, Record<string, string>>, path: string, langId: number) {
    if (!path) {
      return;
    }

    return new Promise((resolve) => {
      const fileStream = createReadStream(path, 'utf-8');

      let key = null;
      let value = null;

      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      rl.on('line', (chunk) => {
        if (chunk.startsWith('msgid')) {
          key = chunk.substring(7, chunk.length - 1);
        }
        if (chunk.startsWith('"') && value === null) {
          key += chunk.substring(1, chunk.length - 1);
        }
        if (chunk.startsWith('msgstr') && key !== null) {
          value = chunk.substring(8, chunk.length - 1);
        }
        if (chunk.startsWith('"') && key !== null) {
          value += chunk.substring(1, chunk.length - 1);
        }

        if (!chunk.length && key && value) {
          keys[key] = keys[key] || {};
          keys[key][langId] = value;
          key = null;
          value = null;
        }
      });

      rl.on('close', () => resolve(null));
    });
  }

  private async getTranslatedKeysFromLangFiles(
    projectId: ProjectEntity['id'],
    timestamp: Date,
    userId: string,
    langsWithFiles: LangWithFile[],
  ): Promise<{
    keys: Omit<TranslatedKeyEntity, 'id'>[];
    uniqueKeysCount: number;
  }> {
    const keysFromLangFiles = {};
    for (const { langId, path } of langsWithFiles) {
      await this.parsePootleFile(keysFromLangFiles, path, langId);
    }

    const keysNames = Object.keys(keysFromLangFiles);
    const keysCount = keysNames.length;

    const translatedKeys = [];
    await concatStream(
      Readable.from(keysNames).pipe(
        new Transform({
          objectMode: true,
          transform: (chunk, _encoding, callback) => {
            for (const { langId, isTranslatable } of langsWithFiles) {
              translatedKeys.push(
                this.keyService.constructTranslatedKeyData({
                  name: chunk,
                  projectId,
                  comment: '',
                  timestamp,
                  langId: +langId,
                  value: keysFromLangFiles[chunk]?.[langId] || chunk,
                  userId: userId,
                  isTranslatableLang: isTranslatable,
                }),
              );
            }
            callback(null);
          },
        }),
      ),
    );

    return {
      keys: translatedKeys,
      uniqueKeysCount: keysCount,
    };
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createProject(data: CreateProjectInputObject): Promise<void> {
    await this.inMemoryStorageService.isHaveLockOrThrow(CREATION_TRANSLATOR_DATA_KEY_LOCK);

    const newProjectId = await this.projectRepository.getNextLangId();
    await this.projectRepository.createFromPlainObject({ id: newProjectId, name: data.name, keysCount: 0 });

    if (!data.langFiles?.length) {
      return;
    }

    const langs = await this.langRepository.getAll();
    const langsWithFiles = langs.map((lang) => {
      const langFile = data.langFiles.find((langFile) => langFile.langId === lang.id);

      return {
        langId: lang.id,
        isTranslatable: lang.isTranslatable,
        path: langFile?.path || null,
      };
    });

    await this.inMemoryStorageService.wrapInLock(CREATION_TRANSLATOR_DATA_KEY_LOCK, async () => {
      const timestamp = new Date();
      const { keys, uniqueKeysCount } = await this.getTranslatedKeysFromLangFiles(
        newProjectId,
        timestamp,
        data.userId,
        langsWithFiles,
      );

      await this.translatedKeyRepository.createChunkedBulk(keys);
      await this.projectRepository.updateOneById(newProjectId, { keysCount: uniqueKeysCount });
    });
  }

  async updateProject(data: UpdateProjectInputObject): Promise<void> {
    await this.projectRepository.updateOneById(data.id, data);
  }
}
