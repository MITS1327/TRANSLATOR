import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InMemoryStorageModule } from '@translator/infrastructure';

import { KeyModule } from '../key';
import { LangModule } from '../lang';
import { ProjectEntityImpl, QueryProjectEntityImpl } from './dal';
import { PROVIDERS } from './project.providers';

const imports = [
  TypeOrmModule.forFeature([ProjectEntityImpl, QueryProjectEntityImpl]),
  LangModule,
  InMemoryStorageModule,
];

@Module({
  imports: [...imports, forwardRef(() => KeyModule)],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class ProjectModule {}
