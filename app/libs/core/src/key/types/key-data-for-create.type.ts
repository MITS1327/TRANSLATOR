import { LangEntity } from '@translator/core/lang';

import { KeyEntity } from '../interfaces';

export type KeyDataForCreate = Omit<KeyEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  langName: LangEntity['name'];
};
