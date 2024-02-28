import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LANG_SERVICE_PROVIDER, LangService } from '@translator/core/lang';

import { CreateLangDTO, GetLangsWithFilterDTO, UpdateLangDTO } from '../dtos';

@Controller({
  path: 'langs',
  version: 'private',
})
@ApiTags('langs')
export class LangPrivateHttpController {
  constructor(@Inject(LANG_SERVICE_PROVIDER) private readonly langService: LangService) {}

  @Post()
  createProject(@Body() data: CreateLangDTO) {
    return this.langService.createLang(data);
  }

  @Get()
  getProjects(@Query() data: GetLangsWithFilterDTO) {
    return this.langService.getLangs(data);
  }

  @Patch(':id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateLangDTO) {
    return this.langService.updateLang({ ...data, id });
  }
}
