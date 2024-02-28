import { LangEntity } from '@translator/core/lang';

import { KeyEntity } from '../interfaces';

export type GroupedKeysByLangName = Record<LangEntity['name'], Record<KeyEntity['name'], KeyEntity['value']>>;
