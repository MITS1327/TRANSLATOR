import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OnlySupportGuard } from '@common/guards';

import { ProjectPrivateHttpController } from './project.private-http-controller';

@UseGuards(OnlySupportGuard)
@Controller({
  path: 'projects',
  version: 'protected',
})
@ApiTags('projects')
export class ProjectProtectedHttpController extends ProjectPrivateHttpController {}
