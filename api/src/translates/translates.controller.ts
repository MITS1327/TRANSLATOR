import { Projects } from '@common/enums/projects.enum';
import { ProductsHash } from '@common/types/productsHash.type';
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
  path: 'translates',
})
export class TranslatesController {
  constructor(private readonly translatesService: TranslatesService) {}

  @Get('getDicts')
  @ApiOkResponse({ description: 'Successfully returned dict or emptry response if hash equals cookie hash' })
  @ApiBadRequestResponse({ description: 'Undefined project' })
  async getDicts(
    @Query() data: GetDictDTO,
    @Cookies('mcn_status') mcnStatus: string,
    @Res() response: Response,
    @Project() project: Projects,
    @Cookies('mcn_translator_products_hash') requestTranslatorProductsHash: ProductsHash,
  ) {
    const { projectName, hash, filesData } = await this.translatesService.getDicts(data, project);
    const responseTranslatorProductsHash = { ...requestTranslatorProductsHash, [projectName]: hash };

    if (hash && hash[projectName] !== mcnStatus) {
      response.cookie('mcn_translator_products_hash', responseTranslatorProductsHash, {
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
