import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LangModule } from '../lang';
import { ProjectEntityImpl } from './dal';
import { PROVIDERS } from './project.providers';

const imports = [TypeOrmModule.forFeature([ProjectEntityImpl]), LangModule];

@Module({
  imports,
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class ProjectModule {}
