import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OnlySupportGuard } from '@common/guards';

import { KeyPrivateHttpController } from './key.private-http-controller';

@UseGuards(OnlySupportGuard)
@Controller({
  version: 'protected',
})
@ApiTags('keys')
export class KeyProtectedHttpController extends KeyPrivateHttpController {}
