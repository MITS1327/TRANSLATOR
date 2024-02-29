import { Inject, Injectable } from '@nestjs/common';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';
import { ProjectEntity } from '@translator/core/project';

import { IN_MEMORY_STORAGE_SERVICE_PROVIDER, InMemoryStorageService } from '@translator/infrastructure';

@Injectable()
export class CacheKeyService {
  constructor(
    @Inject(IN_MEMORY_STORAGE_SERVICE_PROVIDER) private readonly inMemoryStorageService: InMemoryStorageService,
    @Inject(KEY_SERVICE_PROVIDER) private readonly coreKeyService: KeyService,
  ) {}

  private readonly PREFIX_FOR_GROUPED_KEYS = 'GROUPED_KEYS';
  private readonly PREFIX_FOR_TIMESTAMP = 'TIMESTAMP';

  private getTimestampCacheKey(projectId: ProjectEntity['id']): string {
    return `${this.PREFIX_FOR_TIMESTAMP}:${projectId}`;
  }

  private getGroupedTranslatedKeysCacheKey(projectId: ProjectEntity['id']): string {
    return `${this.PREFIX_FOR_GROUPED_KEYS}:${projectId}`;
  }

  async getGroupedTranslatedKeys(
    projectId: ProjectEntity['id'],
    timestamp: number,
  ): Promise<{
    timestamp: number;
    keys: Record<string, unknown>;
  }> {
    let cacheTimestamp = await this.inMemoryStorageService.get(this.getTimestampCacheKey(projectId));

    if (cacheTimestamp && timestamp === cacheTimestamp) {
      return null;
    }

    let cacheData = await this.inMemoryStorageService.get<Record<string, unknown>>(
      this.getGroupedTranslatedKeysCacheKey(projectId),
    );
    if (!cacheData) {
      const data = await this.coreKeyService.getTranslatedKeysGroupedByLangName(projectId);
      const timestamp = Date.now();
      const setDataCommand = await this.inMemoryStorageService.getUpsertCommand(
        this.getGroupedTranslatedKeysCacheKey(projectId),
        data,
      );
      const updateTimestampCommand = await this.inMemoryStorageService.getUpsertCommand(
        this.getTimestampCacheKey(projectId),
        timestamp,
      );
      await this.inMemoryStorageService.executeCommandsInTransaction(setDataCommand, updateTimestampCommand);

      cacheTimestamp = timestamp;
      cacheData = data;
    }

    return {
      timestamp: +cacheTimestamp,
      keys: cacheData,
    };
  }
}
