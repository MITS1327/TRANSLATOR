import { Body, Controller, Get, Headers, Inject, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';
import { Response } from 'express';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';

import { CacheKeyService } from '../cache-key.service';
import { HEADER_FOR_TIMESTAMP } from '../constants';
import { CreateKeyDTO, GetGroupedKeysDTO, GetKeysWithFilterDTO, UpdateKeyDTO } from '../dtos';

@Controller({
  path: 'keys',
  version: 'private',
})
@ApiTags('keys')
export class KeyPrivateHttpController {
  constructor(
    @Inject(KEY_SERVICE_PROVIDER) private readonly coreKeyService: KeyService,
    private readonly cacheKeyService: CacheKeyService,
  ) {}

  @Post()
  createKey(@UserId() userId: string, @Body() data: CreateKeyDTO) {
    return this.coreKeyService.createKey({ ...data, userId });
  }

  @Get()
  getKeys(@Query() data: GetKeysWithFilterDTO) {
    return this.coreKeyService.getKeys(data);
  }

  @ApiHeader({ name: HEADER_FOR_TIMESTAMP, description: 'Product keys cache timestamp', required: false })
  @Get('/grouped')
  async getProjectKeys(
    @Query() data: GetGroupedKeysDTO,
    @Res() response: Response,
    @Headers(HEADER_FOR_TIMESTAMP) requestTimestamp: string,
  ) {
    const result = await this.cacheKeyService.getGroupedKeys(
      data.projectId,
      requestTimestamp ? +requestTimestamp : null,
    );

    if (!result) {
      response.send();

      return;
    }

    response.set({ [HEADER_FOR_TIMESTAMP]: result.timestamp });
    response.json(result.keys);
  }

  @Patch(':id')
  updateKey(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateKeyDTO) {
    return this.coreKeyService.updateKey({ ...data, id });
  }
}
