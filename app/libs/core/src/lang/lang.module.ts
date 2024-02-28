import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LangEntityImpl } from './dal';
import { PROVIDERS } from './lang.providers';

const imports = [TypeOrmModule.forFeature([LangEntityImpl])];

@Module({
  imports,
  providers: [...PROVIDERS],
  exports: [...PROVIDERS, ...imports],
})
export class LangModule {}
