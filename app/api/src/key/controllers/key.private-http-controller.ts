import { Body, Controller, Get, Headers, Inject, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';
import { Response } from 'express';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';

import { CacheKeyService } from '../cache-key.service';
import { HEADER_FOR_TIMESTAMP } from '../constants';
import {
  CreateKeyDTO,
  GetGroupedKeysDTO,
  GetTranslatedKeysWithFilterDTO,
  UpdateKeyDTO,
  UpdateKeyTranslateDTO,
} from '../dtos';

@Controller({
  version: 'private',
})
@ApiTags('keys')
export class KeyPrivateHttpController {
  constructor(
    @Inject(KEY_SERVICE_PROVIDER) private readonly coreKeyService: KeyService,
    private readonly cacheKeyService: CacheKeyService,
  ) {}

  @Post('keys')
  createKey(@UserId() userId: string, @Body() data: CreateKeyDTO) {
    return this.coreKeyService.createKey({ ...data, userId });
  }

  @Get('translated-keys')
  getTranslatedKeys(@Query() data: GetTranslatedKeysWithFilterDTO) {
    return this.coreKeyService.getTranslatedKeys(data);
  }

  @Patch('keys/:name')
  updateKey(@Param('name') name: string, @Body() data: UpdateKeyDTO) {
    return this.coreKeyService.updateKey({ ...data, name });
  }

  @ApiHeader({ name: HEADER_FOR_TIMESTAMP, description: 'Product keys cache timestamp', required: false })
  @Get('translated-keys/grouped')
  async getProjectTranslatedKeys(
    @Query() data: GetGroupedKeysDTO,
    @Res() response: Response,
    @Headers(HEADER_FOR_TIMESTAMP) requestTimestamp: string,
  ) {
    const result = await this.cacheKeyService.getGroupedTranslatedKeys(
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

  @Patch('translated-keys/:id')
  updateKeyTranslate(
    @UserId() userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateKeyTranslateDTO,
  ) {
    return this.coreKeyService.updateKeyTranslate({ ...data, userId, id });
  }
}
