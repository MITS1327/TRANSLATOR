import { TranslatedKeyEntity } from '../interfaces';

export interface UpdateKeyInputObject {
  name: TranslatedKeyEntity['name'];
  projectId: TranslatedKeyEntity['projectId'];
  comment: TranslatedKeyEntity['comment'];
}
