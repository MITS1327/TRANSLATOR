import { LangEntity } from '../interfaces';
import { CreateLangInputObject } from './create-lang.input-object';

export type UpdateLangInputObject = Partial<CreateLangInputObject> & {
  id: LangEntity['id'];
};
