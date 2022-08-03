import { Module } from '@nestjs/common';
import { TranslatesController } from './translates.controller';
import { TranslatesService } from './translates.service';

@Module({
  controllers: [TranslatesController],
  providers: [TranslatesService]
})
export class TranslatesModule { }
