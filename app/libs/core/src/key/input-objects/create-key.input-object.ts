import { TranslatedKeyEntity,TranslatedKeyLog } from '../interfaces';

export interface CreateKeyInputObject {
  name: TranslatedKeyEntity['name'];
  projectId: TranslatedKeyEntity['projectId'];
  userId: TranslatedKeyLog['userId'] | null;
  comment: TranslatedKeyEntity['comment'];
  values?: Array<{
    langId: TranslatedKeyEntity['langId'];
    value: TranslatedKeyEntity['value'];
  }>;
}
