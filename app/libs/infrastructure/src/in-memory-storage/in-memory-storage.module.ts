import { Module } from '@nestjs/common';

import { PROVIDERS } from './in-memory-storage.providers';

@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class InMemoryStorageModule {}
