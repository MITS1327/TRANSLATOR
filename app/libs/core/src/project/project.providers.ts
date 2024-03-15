import { Provider } from '@nestjs/common';

import { ProjectRepositoryImpl, QueryProjectRepositoryImpl } from './dal';
import {
  PROJECT_REPOSITORY_PROVIDER,
  PROJECT_SERVICE_PROVIDER,
  QUERY_PROJECT_REPOSITORY_PROVIDER,
} from './project.di-tokens';
import { ProjectServiceImpl } from './project.service';

const projectRepositoryProvider: Provider = {
  provide: PROJECT_REPOSITORY_PROVIDER,
  useClass: ProjectRepositoryImpl,
};

const queryProjectRepositoryProvider: Provider = {
  provide: QUERY_PROJECT_REPOSITORY_PROVIDER,
  useClass: QueryProjectRepositoryImpl,
};

const projectServiceProvider: Provider = {
  provide: PROJECT_SERVICE_PROVIDER,
  useClass: ProjectServiceImpl,
};

export const PROVIDERS = [projectRepositoryProvider, projectServiceProvider, queryProjectRepositoryProvider];
