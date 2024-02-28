import { Module } from '@nestjs/common';

import { CoreModule } from '@translator/core';

import { ProjectPrivateHttpController, ProjectProtectedHttpController } from './controllers';

@Module({
  imports: [CoreModule],
  controllers: [ProjectPrivateHttpController, ProjectProtectedHttpController],
})
export class ProjectModule {}
