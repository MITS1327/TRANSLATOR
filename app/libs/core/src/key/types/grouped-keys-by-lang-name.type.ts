import { LangEntity } from '@translator/core/lang';

import { TranslatedKeyEntity } from '../interfaces';

export type GroupedTranslatedKeysByLangName = Record<
  LangEntity['name'],
  Record<TranslatedKeyEntity['name'], TranslatedKeyEntity['value']>
>;
