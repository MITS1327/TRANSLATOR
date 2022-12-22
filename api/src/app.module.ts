import { CacheModule, Module } from '@nestjs/common';
import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelpersModule } from './helpers/helpers.module';
import { PootleModule } from './pootle/pootle.module';
import keydbConfig from './config/keydb.config';
import pootleConfig from './config/pootle.config';
import * as redisStore from 'cache-manager-redis-store';
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
        store: redisStore,
        host: configService.get('keydb.host'),
        port: configService.get('keydb.port'),
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
export class AppModule {}
