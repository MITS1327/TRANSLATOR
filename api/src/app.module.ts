import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { HelpersModule } from './helpers/helpers.module';
import redisConfig from './config/redis.config';
import pootleConfig from './config/pootle.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, pootleConfig],
    }),
    TranslatesModule,
    HealthModule,
    HelpersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
