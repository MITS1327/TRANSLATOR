import { Module } from '@nestjs/common';

import { CoreModule } from '@translator/core';

import { InMemoryStorageModule } from '@translator/infrastructure';

import { CacheKeyService } from './cache-key.service';
import {
  KeyMessagingController,
  KeyPrivateHttpController,
  KeyProtectedHttpController,
  KeyPublicHttpController,
} from './controllers';

@Module({
  imports: [CoreModule, InMemoryStorageModule],
  providers: [CacheKeyService],
  controllers: [KeyPrivateHttpController, KeyProtectedHttpController, KeyMessagingController, KeyPublicHttpController],
})
export class KeyModule {}
