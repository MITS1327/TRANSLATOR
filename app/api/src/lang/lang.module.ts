import { Module } from '@nestjs/common';

import { CoreModule } from '@translator/core';

import { LangPrivateHttpController, LangProtectedHttpController } from './controllers';

@Module({
  imports: [CoreModule],
  controllers: [LangPrivateHttpController, LangProtectedHttpController],
})
export class LangModule {}
