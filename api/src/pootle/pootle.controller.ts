import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UpdateDictsDTO } from './common/pootle.dto';
import { PootleService } from './pootle.service';

@ApiTags('pootle')
@Controller({
  version: 'private',
  path: 'pootle'
})
export class PootleController {
  constructor(private readonly translatesService: PootleService) { }

  @Post('updateDicts')
  @ApiCreatedResponse()
  async updateDicts(@Body() data: UpdateDictsDTO) {
    this.translatesService.updateDicts(data);
  }
}