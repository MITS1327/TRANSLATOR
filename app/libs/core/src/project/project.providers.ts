import { Provider } from '@nestjs/common';

import { ProjectRepositoryImpl } from './dal';
import { PROJECT_REPOSITORY_PROVIDER, PROJECT_SERVICE_PROVIDER } from './project.di-tokens';
import { ProjectServiceImpl } from './project.service';

const projectRepositoryProvider: Provider = {
  provide: PROJECT_REPOSITORY_PROVIDER,
  useClass: ProjectRepositoryImpl,
};

const projectServiceProvider: Provider = {
  provide: PROJECT_SERVICE_PROVIDER,
  useClass: ProjectServiceImpl,
};

export const PROVIDERS = [projectRepositoryProvider, projectServiceProvider];
