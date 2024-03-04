import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { GraylogInterceptor } from 'api/src/common/interceptors/graylog.interceptor';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { SwaggerDocsGenerator } from '@translator/infrastructure';

import { ApiModule } from './api.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>(configService.getOrThrow('kafka'));
  useContainer(app.select(ApiModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: '',
  });
  app.useGlobalInterceptors(
    new GraylogInterceptor(
      configService.get('common.graylogHost'),
      configService.get('common.graylogPort'),
      configService.get('common.project'),
    ),
  );
  app.use(cookieParser());

  const docsGenerator = app.select(ApiModule).get(SwaggerDocsGenerator);
  docsGenerator.setApp(app);
  docsGenerator.init();

  const port = process.env.port || 3000;
  await app.listen(port, () => console.log(`listening at http://localhost:${port}`));
  await app.startAllMicroservices().catch((error) => {
    console.log(error);
  });
}
bootstrap();
