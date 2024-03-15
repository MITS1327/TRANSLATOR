import { LangEntity } from '@translator/core/lang';

import { BaseEntity } from '@translator/shared/core';

export type UntranslatedKeysByLang = Record<LangEntity['name'], number>;

export interface QueryProjectEntity extends BaseEntity {
  id: number;
  name: string;
  keysCount: number;
  untranslatedKeysByLang: UntranslatedKeysByLang;
}
