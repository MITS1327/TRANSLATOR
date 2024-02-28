import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { GraylogInterceptor } from 'api/src/common/interceptors/graylog.interceptor';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
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
  const config = new DocumentBuilder()
    .setTitle('Translator API')
    .setDescription('API for translations and scripts')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  const port = process.env.port || 3000;
  await app.listen(port, () => console.log(`listening at http://localhost:${port}`));
}
bootstrap();
