import { LangEntity } from '../interfaces';

export interface CreateLangInputObject {
  name: LangEntity['name'];
  userId: string | null;
  isTranslatable: LangEntity['isTranslatable'];
}
