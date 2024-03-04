import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { redisStore } from 'cache-manager-ioredis-yet';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import configs from '@translator/shared/configs';

import { HealthModule, SwaggerDocsGenerator } from '@translator/infrastructure';

import { ApiController } from './api.controller';
import apiConfigs from './configs';
import { KeyModule } from './key';
import { LangModule } from './lang';
import { PootleModule } from './pootle/pootle.module';
import { ProjectModule } from './project';
import { TranslatesModule } from './translates/translates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs, ...apiConfigs],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.getOrThrow('db') }),
      dataSourceFactory: async (options) => addTransactionalDataSource(new DataSource(options)),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          sentinels: configService.getOrThrow('redis.sentinels'),
          name: configService.getOrThrow('redis.name'),
          db: configService.getOrThrow('redis.db'),
        }),
      }),
      inject: [ConfigService],
    }),
    TranslatesModule,
    HealthModule,
    PootleModule,
    ProjectModule,
    LangModule,
    KeyModule,
  ],
  providers: [SwaggerDocsGenerator],
  controllers: [ApiController],
})
export class ApiModule {}
