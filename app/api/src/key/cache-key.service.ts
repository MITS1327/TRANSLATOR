import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { KEY_SERVICE_PROVIDER, KeyService, TranslatedKeyEntity } from '@translator/core/key';
import { CreateKeyClientEventData, UpdateKeyClientEventData } from '@translator/core/key/events';
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

  private async getCacheOrThrow(projectId: ProjectEntity['id']): Promise<Record<string, unknown>> {
    const data = await this.inMemoryStorageService.get<Record<string, unknown>>(
      this.getGroupedTranslatedKeysCacheKey(projectId),
    );
    if (!data) {
      throw new ConflictException('Cache not found');
    }

    return data;
  }

  async addKey(dto: CreateKeyClientEventData) {
    const data = await this.getCacheOrThrow(dto.projectId);
    const timestamp = Date.now();

    const newData = structuredClone(data);
    dto.values.map((value) => {
      newData[value.langName][dto.keyName] = value.value;
    });

    await this.upsertCache(dto.projectId, newData, timestamp);
  }

  async updateKey(dto: UpdateKeyClientEventData) {
    const data = await this.getCacheOrThrow(dto.projectId);
    const timestamp = Date.now();

    const newData = structuredClone(data);
    newData[dto.langName][dto.keyName] = dto.keyValue;

    await this.upsertCache(dto.projectId, newData, timestamp);
  }

  private async upsertCache(
    projectId: TranslatedKeyEntity['projectId'],
    data: Record<string, unknown>,
    timestamp: number,
  ): Promise<void> {
    const setDataCommand = await this.inMemoryStorageService.getUpsertCommand(
      this.getGroupedTranslatedKeysCacheKey(projectId),
      data,
    );
    const updateTimestampCommand = await this.inMemoryStorageService.getUpsertCommand(
      this.getTimestampCacheKey(projectId),
      timestamp,
    );
    await this.inMemoryStorageService.executeCommandsInTransaction(setDataCommand, updateTimestampCommand);
  }

  async getProjectCacheTimestamp(projectId: ProjectEntity['id']): Promise<number> {
    const cacheTimestamp = await this.inMemoryStorageService.get(this.getTimestampCacheKey(projectId));

    return cacheTimestamp ? +cacheTimestamp : null;
  }

  async getGroupedTranslatedKeys(projectId: ProjectEntity['id']): Promise<{
    keys: Record<string, unknown>;
    cacheTimestamp: number;
  }> {
    let keys = await this.inMemoryStorageService.get<Record<string, unknown>>(
      this.getGroupedTranslatedKeysCacheKey(projectId),
    );
    let cacheTimestamp = await this.inMemoryStorageService.get(this.getTimestampCacheKey(projectId));

    if (!keys) {
      keys = await this.coreKeyService.getTranslatedKeysGroupedByLangName(projectId);
      cacheTimestamp = Date.now();
      await this.upsertCache(projectId, keys, +cacheTimestamp);
    }

    return { keys, cacheTimestamp: +cacheTimestamp };
  }
}
