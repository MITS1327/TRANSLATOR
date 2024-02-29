import { LangEntity } from '@translator/core/lang';

import { TranslatedKeyEntity } from '../interfaces';

export type KeyDataForCreate = Omit<TranslatedKeyEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  langName: LangEntity['name'];
};
