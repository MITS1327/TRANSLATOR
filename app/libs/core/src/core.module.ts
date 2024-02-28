import { Module } from '@nestjs/common';

import { KeyModule } from './key';
import { LangModule } from './lang';
import { ProjectModule } from './project';

const modules = [ProjectModule, LangModule, KeyModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class CoreModule {}
