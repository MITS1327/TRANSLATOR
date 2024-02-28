import { Module } from '@nestjs/common';

import { LangModule } from './lang';
import { ProjectModule } from './project';

const modules = [ProjectModule, LangModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class CoreModule {}
