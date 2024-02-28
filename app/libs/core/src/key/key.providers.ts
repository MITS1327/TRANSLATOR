import { Provider } from '@nestjs/common';

import { KeyRepositoryImpl } from './dal';
import { KEY_REPOSITORY_PROVIDER, KEY_SERVICE_PROVIDER } from './key.di-tokens';
import { KeyServiceImpl } from './key.service';

const keyRepositoryProvider: Provider = {
  provide: KEY_REPOSITORY_PROVIDER,
  useClass: KeyRepositoryImpl,
};

const keyServiceProvider: Provider = {
  provide: KEY_SERVICE_PROVIDER,
  useClass: KeyServiceImpl,
};

export const PROVIDERS = [keyRepositoryProvider, keyServiceProvider];
