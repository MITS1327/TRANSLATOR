import { Module } from '@nestjs/common';

import { CoreModule } from '@translator/core';

import { KeyPrivateHttpController, KeyProtectedHttpController } from './controllers';

@Module({
  imports: [CoreModule],
  controllers: [KeyPrivateHttpController, KeyProtectedHttpController],
})
export class KeyModule {}
