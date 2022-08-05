import { Module, CacheModule } from '@nestjs/common';
import { TranslatesController } from './translates.controller';
import { TranslatesService } from './translates.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from "cache-manager-redis-store";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get("redis.host"),
        port: configService.get("redis.port"),
        db: 1,
        ttl: 0
      }),
      inject: [ConfigService],
    }),
    HttpModule
  ],
  controllers: [TranslatesController],
  providers: [TranslatesService]
})
export class TranslatesModule { }
