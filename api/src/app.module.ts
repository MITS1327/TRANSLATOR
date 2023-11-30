import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from './health/health.module';
import { PootleModule } from './pootle/pootle.module';

import keydbConfig from './config/keydb.config';
import pootleConfig from './config/pootle.config';
import graylogConfig from './config/graylog.config';
import commonConfig from './config/common.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keydbConfig, pootleConfig, graylogConfig, commonConfig],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.getOrThrow('keydb.host'),
            port: configService.getOrThrow('keydb.port'),
          },
          database: 1,
        }),
      }),
      inject: [ConfigService],
    }),
    TranslatesModule,
    HealthModule,
    PootleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
