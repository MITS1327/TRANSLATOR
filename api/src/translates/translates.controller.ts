import { Projects } from '@common/enums/projects.enum';
import { SupportGuard } from '@common/guards/support.guard';
import { Project } from '@decorators/project.decorator';
import { Body, Controller, Get, Headers, Post, Query, Res, UseGuards, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ChangeKeyDTO, GetDictDTO, GetNotTranslatedDictsDTO } from './common/translates.dto';
import { TranslatesService } from './translates.service';

@ApiTags('translates')
@Controller('translates')
export class TranslatesController {
  constructor(private readonly translatesService: TranslatesService) {}

  @Version('public')
  @Get('dicts')
  @ApiOkResponse({ description: 'Successfully returned dict or emptry response if hash equals cookie hash' })
  @ApiBadRequestResponse({ description: 'Undefined project' })
  @ApiHeader({ name: 'x-products-hash', description: 'Dict hash', required: false })
  async getDicts(
    @Query() data: GetDictDTO,
    @Res() response: Response,
    @Project() project: Projects,
    @Headers('x-products-hash') requestTranslatorProductsHash: string,
  ) {
    const { projectName, unixTime, filesData } = await this.translatesService.getDicts(data, project);
    let requestHeader = null;

    try {
      requestHeader = JSON.parse(requestTranslatorProductsHash);
      //eslint-disable-next-line no-empty
    } catch (error) {}
    const responseTranslatorProductsHash = { ...requestHeader, [projectName]: unixTime };

    if (unixTime !== requestHeader?.[projectName]) {
      response.set({'x-products-hash': JSON.stringify(responseTranslatorProductsHash)});
      response.json(filesData);
    } else {
      response.send();
    }
  }

  @Version('protected')
  @Post('key')
  @ApiOkResponse({ description: 'Successfully changed key' })
  @ApiForbiddenResponse({ description: 'You need a support role' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBadRequestResponse({ description: 'Undefined project' })
  async changeKey(@Body() data: ChangeKeyDTO, @Project() project: Projects) {
    return this.translatesService.changeKey(data, project);
  }

  @Version('protected')
  @Get('langs')
  @ApiOkResponse({ description: 'Successfully get langs' })
  @ApiForbiddenResponse({ description: 'You need a support role' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @UseGuards(SupportGuard)
  async getLangs() {
    return this.translatesService.getLangs();
  }

  @Version('protected')
  @Get('projects')
  @ApiOkResponse({ description: 'Successfully get projects' })
  @ApiForbiddenResponse({ description: 'You need a support role' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @UseGuards(SupportGuard)
  async getProjects() {
    return this.translatesService.getProjects();
  }

  @Version('protected')
  @Get('keys/not-translated')
  @ApiOkResponse({ description: 'Successfully get not translated projects' })
  @ApiForbiddenResponse({ description: 'You need a support role' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @UseGuards(SupportGuard)
  async getNotTranslatedDicts(@Query() data: GetNotTranslatedDictsDTO) {
    return this.translatesService.getNotTranslatedDicts(data);
  }
}
