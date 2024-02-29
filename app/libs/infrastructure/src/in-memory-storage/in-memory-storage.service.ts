import { Inject, Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';

import { REDIS_CLIENT_PROVIDER, REDLOCK_PROVIDER } from './in-memory-storage.di-tokens';
import { InMemoryStorageService, LockObject, StorageCommand } from './interfaces';

@Injectable()
export class InMemoryStorageServiceImpl implements InMemoryStorageService {
  constructor(
    @Inject(REDIS_CLIENT_PROVIDER) private readonly redisClient: Redis,
    @Inject(REDLOCK_PROVIDER) private readonly redisLock: Redlock,
  ) {}

  private readonly DEFAULT_LOCK_TIMEOUT = 5000;
  private readonly LOCK_PREFIX = 'lock';

  async upsert<T = unknown>(key: string, data: T): Promise<void> {
    await this.executeCommand(this.getUpsertCommand(key, data));
  }

  getUpsertCommand<T = unknown>(key: string, data: T): string[] {
    return ['set', key, JSON.stringify(data)];
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

  async isHaveLock(key: string): Promise<boolean> {
    const lock = await this.redisClient.get(`${this.LOCK_PREFIX}:${key}`);

    return !!lock;
  }

  async lock(key: string): Promise<LockObject> {
    const lockInstance = await this.redisLock.acquire([`${this.LOCK_PREFIX}:${key}`], this.DEFAULT_LOCK_TIMEOUT);

    return {
      instance: lockInstance,
    };
  }

  async releaseLock(lockObject: LockObject): Promise<void> {
    if (!lockObject.instance) {
      return;
    }
    await this.redisLock.release(lockObject.instance as Lock);
  }
}
