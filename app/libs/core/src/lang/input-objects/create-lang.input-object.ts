import { LangEntity } from '../interfaces';

export interface CreateLangInputObject {
  name: LangEntity['name'];
  isTranslatable: LangEntity['isTranslatable'];
}
