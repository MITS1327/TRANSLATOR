import { Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { UpdateDictsDTO, UpdateDictsParams } from './common/pootle.dto';
import { PootleService } from './pootle.service';

@ApiTags('pootle')
@Controller({
  version: 'private',
  path: 'pootle',
})
export class PootleController {
  constructor(private readonly translatesService: PootleService) {}

  @Put('dicts/:project')
  @ApiAcceptedResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  async updateProjectDicts(@Body() data: UpdateDictsDTO, @Param() params: UpdateDictsParams) {
    this.translatesService.updateProjectDicts(data, params.project);
  }

  @Put('dicts')
  @ApiAcceptedResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  async updateDicts() {
    this.translatesService.updateDicts();
  }
}
