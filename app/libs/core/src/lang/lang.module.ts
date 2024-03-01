import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutgoingEventModule } from '@translator/messaging';

import { LangEntityImpl } from './dal';
import { PROVIDERS } from './lang.providers';

const imports = [TypeOrmModule.forFeature([LangEntityImpl]), OutgoingEventModule];

@Module({
  imports,
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class LangModule {}
