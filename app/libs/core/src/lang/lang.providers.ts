import { Provider } from '@nestjs/common';

import { ProjectRepositoryImpl } from './dal';
import { LANG_REPOSITORY_PROVIDER, LANG_SERVICE_PROVIDER } from './lang.di-tokens';
import { LangServiceImpl } from './lang.service';

const projectRepositoryProvider: Provider = {
  provide: LANG_REPOSITORY_PROVIDER,
  useClass: ProjectRepositoryImpl,
};

const langServiceProvider: Provider = {
  provide: LANG_SERVICE_PROVIDER,
  useClass: LangServiceImpl,
};

export const PROVIDERS = [projectRepositoryProvider, langServiceProvider];
