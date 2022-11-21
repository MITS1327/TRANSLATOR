import { Projects } from '@common/enums/projects.enum';
import { Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ApiAcceptedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateDictsDTO } from './common/pootle.dto';
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
  @ApiParam({
    name: 'project',
    enum: Object.keys(Projects)
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async updateProjectDicts(@Body() data: UpdateDictsDTO, @Param('project') project: keyof typeof Projects) {
    this.translatesService.updateProjectDicts(data, project);
  }

  @Put('dicts')
  @ApiAcceptedResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  async updateDicts() {
    this.translatesService.updateDicts();
  }
}
