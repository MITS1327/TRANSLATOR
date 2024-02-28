import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectEntityImpl } from './dal';
import { PROVIDERS } from './project.providers';

const imports = [TypeOrmModule.forFeature([ProjectEntityImpl])];

@Module({
  imports,
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class ProjectModule {}
