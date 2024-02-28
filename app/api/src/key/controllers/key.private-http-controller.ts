import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';

import { CreateKeyDTO, GetGroupedKeysDTO, GetKeysWithFilterDTO, UpdateKeyDTO } from '../dtos';

@Controller({
  path: 'keys',
  version: 'private',
})
@ApiTags('keys')
export class KeyPrivateHttpController {
  constructor(@Inject(KEY_SERVICE_PROVIDER) private readonly coreKeyService: KeyService) {}

  @Post()
  createKey(@UserId() userId: string, @Body() data: CreateKeyDTO) {
    return this.coreKeyService.createKey({ ...data, userId });
  }

  @Get()
  getKeys(@Query() data: GetKeysWithFilterDTO) {
    return this.coreKeyService.getKeys(data);
  }

  @Get('/grouped')
  getProjectKeys(@Query() data: GetGroupedKeysDTO) {
    return this.coreKeyService.getProjectKeysGroupedByLangName(data.projectId);
  }

  @Patch(':id')
  updateKey(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateKeyDTO) {
    return this.coreKeyService.updateKey({ ...data, id });
  }
}
