import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { redisStore } from 'cache-manager-ioredis-yet';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import configs from '@translator/shared/configs';

import { KeyModule } from './key';
import { LangModule } from './lang';
import { PootleModule } from './pootle/pootle.module';
import { ProjectModule } from './project';
import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from '@translator/infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
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
          host: configService.getOrThrow('keydb.host'),
          port: configService.getOrThrow('keydb.port'),
          db: 1,
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
})
export class AppModule {}
