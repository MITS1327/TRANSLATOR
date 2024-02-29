import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutgoingEventModule } from '@translator/messaging';

import { LangModule } from '../lang';
import { ProjectModule } from '../project';
import { KeyEntityImpl } from './dal';
import { PROVIDERS } from './key.providers';

const imports = [TypeOrmModule.forFeature([KeyEntityImpl]), LangModule, ProjectModule, OutgoingEventModule];

@Module({
  imports,
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class KeyModule {}
