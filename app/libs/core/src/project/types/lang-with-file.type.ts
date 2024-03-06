import { LangEntity } from '@translator/core/lang';

export type LangWithFile = {
  langId: LangEntity['id'];
  isTranslatable: LangEntity['isTranslatable'];
  path: string | null;
};
