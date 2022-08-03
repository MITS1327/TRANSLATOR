import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslatesModule } from './translates/translates.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [TranslatesModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
