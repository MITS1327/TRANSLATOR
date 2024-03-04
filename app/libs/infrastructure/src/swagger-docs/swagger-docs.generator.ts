import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerDocsGenerator {
  private app: INestApplication;
  private documents: Record<string, OpenAPIObject> = {};

  setApp(app: INestApplication) {
    this.app = app;
  }

  getDocument(key: string) {
    return this.documents[key];
  }

  private readonly versions = [
    {
      name: 'protected',
      url: '/api/protected/swagger',
      config: new DocumentBuilder()
        .setTitle('Translator Protected Methods')
        .setDescription('protected methods')
        .setVersion('1.1')
        .build(),
    },
    {
      name: 'public',
      url: '/api/public/swagger',
      config: new DocumentBuilder()
        .setTitle('Translator Public Methods')
        .setDescription('public methods')
        .setVersion('1.1')
        .build(),
    },
    {
      name: 'private',
      url: '/api/private/swagger',
      config: new DocumentBuilder()
        .setTitle('Translator Private Methods')
        .setDescription('private methods')
        .setVersion('1.1')
        .build(),
    },
  ];

  init() {
    if (!this.app) {
      throw new Error('App not found');
    }

    for (const version of this.versions) {
      const paths = {};
      const { config } = version;
      const tempDoc = SwaggerModule.createDocument(this.app, config);

      for (const key of Object.keys(tempDoc.paths)) {
        const path = key.split('/');
        if (path[2] === version.name) {
          if (key === `/api/${version.name}/swagger`) {
            continue;
          }
          paths[key] = tempDoc.paths[key];
        }
      }
      const document: OpenAPIObject = { ...tempDoc, paths };

      this.documents[version.name] = document;
    }
  }
}
