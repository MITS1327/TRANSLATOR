import { Controller, Get, Req, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';

import { Request } from 'express';

import { SwaggerDocsGenerator } from '@translator/infrastructure';

@Controller()
@ApiExcludeController()
export class ApiController {
  constructor(
    private readonly configService: ConfigService,
    private readonly swaggerDocsGenerator: SwaggerDocsGenerator,
  ) {}

  @Version(['private', 'protected', 'public'])
  @Get(process.env.SWAGGER_PATH)
  getPrivateDocs(@Req() req: Request) {
    const apiPrefix = this.configService.getOrThrow('apiConfig.prefix');
    const swaggerPath = this.configService.getOrThrow('apiConfig.swaggerPath');
    const regex = `(?<=/${apiPrefix}/).*(?=/${swaggerPath})`;
    const version = req.path.match(regex)?.[0];
    const docs = this.swaggerDocsGenerator.getDocument(version);

    const serverUrl = `${req.headers['x-forwarded-proto']}://${req.hostname}`;
    docs.servers = [{ url: serverUrl }];

    return docs;
  }
}
