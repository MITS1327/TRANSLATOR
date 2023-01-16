import { Projects } from '@common/enums/projects.enum';
import { SupportGuard } from '@common/guards/support.guard';
import { ProductsHash } from '@common/types/productsHash.type';
import { Cookies } from '@decorators/cookie.decorator';
import { Project } from '@decorators/project.decorator';
import { Body, Controller, Get, Post, Query, Res, UseGuards, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
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
  async getDicts(
    @Query() data: GetDictDTO,
    @Res() response: Response,
    @Project() project: Projects,
    @Cookies('mcn_translator_products_hash') requestTranslatorProductsHash: ProductsHash,
  ) {
    const { projectName, hash, filesData } = await this.translatesService.getDicts(data, project);
    const responseTranslatorProductsHash = { ...requestTranslatorProductsHash, [projectName]: hash };

    if (hash && hash !== requestTranslatorProductsHash?.[projectName]) {
      response.cookie('mcn_translator_products_hash', responseTranslatorProductsHash, {
        sameSite: 'strict',
        secure: true
      });
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
