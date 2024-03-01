import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutgoingEventModule } from '@translator/messaging';

import { InMemoryStorageModule } from '@translator/infrastructure';

import { KeyModule } from '../key';
import { LangEntityImpl } from './dal';
import { PROVIDERS } from './lang.providers';

const imports = [TypeOrmModule.forFeature([LangEntityImpl]), OutgoingEventModule, InMemoryStorageModule];

@Module({
  imports: [...imports, forwardRef(() => KeyModule)],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class LangModule {}
