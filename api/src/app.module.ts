import { CacheModule, Module } from '@nestjs/common';
import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelpersModule } from './helpers/helpers.module';
import { PootleModule } from './pootle/pootle.module';
import redisConfig from './config/redis.config';
import pootleConfig from './config/pootle.config';
import * as redisStore from 'cache-manager-redis-store';
import graylogConfig from './config/graylog.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, pootleConfig, graylogConfig],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        db: 1,
        ttl: 0,
      }),
      inject: [ConfigService],
    }),
    TranslatesModule,
    HealthModule,
    HelpersModule,
    PootleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
