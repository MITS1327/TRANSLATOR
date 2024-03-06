import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { CacheKeyService } from '../cache-key.service';
import { HEADER_FOR_TIMESTAMP } from '../constants';
import { GetGroupedKeysDTO } from '../dtos';

@Controller({
  version: 'public',
})
@ApiTags('keys')
export class KeyPublicHttpController {
  constructor(private readonly cacheKeyService: CacheKeyService) {}

  @ApiHeader({ name: HEADER_FOR_TIMESTAMP, description: 'Product keys cache timestamp', required: false })
  @Get('translated-keys/grouped')
  async getProjectTranslatedKeys(
    @Query() data: GetGroupedKeysDTO,
    @Res() response: Response,
    @Headers(HEADER_FOR_TIMESTAMP) requestTimestamp: string,
  ) {
    const projectCacheTimestamp = await this.cacheKeyService.getProjectCacheTimestamp(data.projectId);
    if (requestTimestamp && projectCacheTimestamp && projectCacheTimestamp === +requestTimestamp) {
      response.send();

      return;
    }

    const result = await this.cacheKeyService.getGroupedTranslatedKeys(data.projectId);

    response.set({ [HEADER_FOR_TIMESTAMP]: result.cacheTimestamp });
    response.json(result.keys);
  }
}
