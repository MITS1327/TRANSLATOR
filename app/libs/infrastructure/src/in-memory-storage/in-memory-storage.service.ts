import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';
import Redlock from 'redlock';

import { REDIS_CLIENT_PROVIDER, REDLOCK_PROVIDER } from './in-memory-storage.di-tokens';
import { InMemoryStorageService, StorageCommand } from './interfaces';

@Injectable()
export class InMemoryStorageServiceImpl implements InMemoryStorageService {
  constructor(
    @Inject(REDIS_CLIENT_PROVIDER) private readonly redisClient: Redis,
    @Inject(REDLOCK_PROVIDER) private readonly redisLock: Redlock,
  ) {}

  private readonly DEFAULT_LOCK_TIMEOUT = 10000;
  private readonly LOCK_PREFIX = 'lock';

  async upsert<T = unknown>(key: string, data: T): Promise<void> {
    await this.executeCommand(this.getUpsertCommand(key, data));
  }

  getUpsertCommand<T = unknown>(key: string, data: T): string[] {
    return ['set', key, JSON.stringify(data)];
  }

  async delete(key: string): Promise<void> {
    await this.executeCommand(this.getDeleteCommand(key));
  }

  getDeleteCommand(key: string): string[] {
    return ['del', key];
  }

  async clear(): Promise<void> {
    await this.executeCommand(['flushdb']);
  }

  async executeCommand(command: StorageCommand): Promise<void> {
    //@ts-expect-error - ioredis types are not up to date
    await this.redisClient.call(...command);
  }

  async executeCommandsInTransaction(...commands: StorageCommand[]): Promise<void> {
    await this.redisClient.multi(commands).exec();
  }

  async get<T = unknown>(key: string): Promise<T> {
    const data = await this.redisClient.get(key);

    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error parsing data');
    }
  }

  private getLockKey(key: string): string {
    return `${this.LOCK_PREFIX}:${key}`;
  }

  async isHaveLockOrThrow(key: string): Promise<boolean> {
    const lock = await this.redisClient.get(this.getLockKey(key));

    if (lock) {
      throw new ConflictException('Lock is already acquired');
    }

    return false;
  }

  wrapInLock<T = unknown>(key: string, callback: () => Promise<T>): Promise<T> {
    return this.redisLock.using<T>([this.getLockKey(key)], this.DEFAULT_LOCK_TIMEOUT, callback);
  }
}
