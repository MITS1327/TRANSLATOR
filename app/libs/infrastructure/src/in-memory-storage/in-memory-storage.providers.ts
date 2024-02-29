import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Redis } from 'ioredis';
import Redlock from 'redlock';

import {
  IN_MEMORY_STORAGE_SERVICE_PROVIDER,
  REDIS_CLIENT_PROVIDER,
  REDLOCK_PROVIDER,
} from './in-memory-storage.di-tokens';
import { InMemoryStorageServiceImpl } from './in-memory-storage.service';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const redisInstance = new Redis({
      sentinels: configService.getOrThrow('redis.sentinels'),
      name: configService.getOrThrow('redis.name'),
      db: configService.getOrThrow('redis.db'),
    });

    return redisInstance;
  },
  inject: [ConfigService],
};

export const redLockFactory: FactoryProvider<Redlock> = {
  provide: REDLOCK_PROVIDER,
  useFactory: (redisClient: Redis) => {
    return new Redlock([redisClient], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 100,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    });
  },
  inject: [REDIS_CLIENT_PROVIDER],
};

const inMemoryStorageServiceProvider: Provider = {
  provide: IN_MEMORY_STORAGE_SERVICE_PROVIDER,
  useClass: InMemoryStorageServiceImpl,
};

export const PROVIDERS = [redisClientFactory, redLockFactory, inMemoryStorageServiceProvider];
