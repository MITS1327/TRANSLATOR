import { Module } from '@nestjs/common';

import { ProjectModule } from './project';

const modules = [ProjectModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class CoreModule {}
