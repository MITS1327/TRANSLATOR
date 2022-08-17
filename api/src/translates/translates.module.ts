import { Module } from '@nestjs/common';
import { TranslatesController } from './translates.controller';
import { TranslatesService } from './translates.service';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [

    HttpModule,
  ],
  controllers: [TranslatesController],
  providers: [TranslatesService],
})
export class TranslatesModule { }
