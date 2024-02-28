import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OnlySupportGuard } from '@common/guards';

import { LangPrivateHttpController } from './lang.private-http-controller';

@UseGuards(OnlySupportGuard)
@Controller({
  path: 'langs',
  version: 'protected',
})
@ApiTags('langs')
export class LangProtectedHttpController extends LangPrivateHttpController {}
