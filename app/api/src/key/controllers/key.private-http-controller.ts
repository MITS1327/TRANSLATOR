import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserId } from '@decorators/auth.decorators';
import { Response } from 'express';
import { rm } from 'fs/promises';
import { diskStorage } from 'multer';

import { KEY_SERVICE_PROVIDER, KeyService } from '@translator/core/key';

import { CacheKeyService } from '../cache-key.service';
import { FILE_TYPE, MAX_FILE_SIZE } from '../constants';
import {
  ClearCachedKeysDTO,
  CreateKeyDTO,
  ExportToJSONDTO,
  GetTranslatedKeysWithFilterDTO,
  ImportFromJSONDTO,
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

  @ApiConsumes('multipart/form-data')
  @Post('translated-keys/import')
  @UseInterceptors(
    FileInterceptor('translatedFile', {
      storage: diskStorage({
        destination: '/tmp/translated_files',
      }),
    }),
  )
  async importFromJSON(
    @UserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: FILE_TYPE }),
        ],
      }),
    )
    translatedFile: Express.Multer.File,
    @Body() data: ImportFromJSONDTO,
  ) {
    await this.coreKeyService.importFromJSON({
      projectId: data.projectId,
      langId: data.langId,
      userId,
      filePath: translatedFile.path,
    });

    await rm(translatedFile.path);
  }
}
