import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TranslatesController } from './translates.controller';
import { TranslatesService } from './translates.service';

@Module({
  imports: [HttpModule],
  controllers: [TranslatesController],
  providers: [TranslatesService],
})
export class TranslatesModule {}
