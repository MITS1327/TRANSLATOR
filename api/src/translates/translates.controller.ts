import { Projects } from '@common/enums/projects.enum';
import { Cookies } from '@decorators/cookie.decorator';
import { Project } from '@decorators/project.decorator';
import { Body, Controller, Get, Patch, Query, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChangeKeyDTO, GetDictDTO } from './common/translates.dto';
import { TranslatesService } from './translates.service';

@ApiTags('translates')
@Controller({
  version: 'public',
  path: 'translates'
})
export class TranslatesController {
  constructor(private readonly translatesService: TranslatesService) { }

  @Get('getDicts')
  @ApiOkResponse({ description: 'Successfully returned dict' })
  @ApiBadRequestResponse({ description: 'Undefined project' })
  async getDicts(@Query() data: GetDictDTO, @Cookies('mcn_status') mcnStatus: string, @Res() response: Response, @Project() project: Projects) {
    const { hash, filesData } = (await this.translatesService.getDicts(data, project)) || {};

    if (hash && hash !== mcnStatus) {
      response.cookie('mcn_translator_hash', hash, {
        sameSite: 'strict',
        httpOnly: true,
      });
      response.json(filesData);
    } else {
      response.send();
    }
  }

  @Patch('changeKey')
  @ApiOkResponse({ description: 'Successfully changed key' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBadRequestResponse({ description: 'Undefined project' })
  async changeKey(@Body() data: ChangeKeyDTO, @Project() project: Projects) {
    return this.translatesService.changeKey(data, project);
  }
}
