import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { UpdateDictsDTO } from './common/pootle.dto';
import { PootleService } from './pootle.service';

@ApiTags('pootle')
@Controller({
  version: 'private',
  path: 'pootle',
})
export class PootleController {
  constructor(private readonly translatesService: PootleService) {}

  @Put('dicts')
  @ApiAcceptedResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  async updateDicts(@Body() data: UpdateDictsDTO) {
    this.translatesService.updateDicts(data);
  }
}
