import { Provider } from '@nestjs/common';

import { TranslatedKeyRepositoryImpl } from './dal';
import { KEY_SERVICE_PROVIDER,TRANSLATED_KEY_REPOSITORY_PROVIDER } from './key.di-tokens';
import { KeyServiceImpl } from './key.service';

const keyRepositoryProvider: Provider = {
  provide: TRANSLATED_KEY_REPOSITORY_PROVIDER,
  useClass: TranslatedKeyRepositoryImpl,
};

const keyServiceProvider: Provider = {
  provide: KEY_SERVICE_PROVIDER,
  useClass: KeyServiceImpl,
};

export const PROVIDERS = [keyRepositoryProvider, keyServiceProvider];
