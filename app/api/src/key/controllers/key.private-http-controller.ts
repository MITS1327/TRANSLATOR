import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';
import { Response } from 'express';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';

import { CacheKeyService } from '../cache-key.service';
import {
  ClearCachedKeysDTO,
  CreateKeyDTO,
  ExportToJSONDTO,
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

  @Post('translated-keys/grouped/clear-cache')
  @HttpCode(HttpStatus.OK)
  async clearCache(@Query() data: ClearCachedKeysDTO) {
    await this.cacheKeyService.clearProjectCache(data.projectId);
  }

  @Patch('translated-keys/:id')
  updateKeyTranslate(
    @UserId() userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateKeyTranslateDTO,
  ) {
    return this.coreKeyService.updateKeyTranslate({ ...data, userId, id });
  }

  @Post('translated-keys/export')
  async exportToJSON(@Body() data: ExportToJSONDTO, @Res() res: Response) {
    const result = await this.coreKeyService.exportToJSON(data);

    res.set({
      'Content-Type': result.mimeType,
    });

    result.stream.pipe(res);
  }
}
