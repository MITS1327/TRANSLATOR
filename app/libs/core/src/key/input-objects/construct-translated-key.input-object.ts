import { TranslatedKeyEntity, TranslatedKeyLog } from '../interfaces';

export interface ConstructTranslatedKeyInputObject {
  name: TranslatedKeyEntity['name'];
  projectId: TranslatedKeyEntity['projectId'];
  langId: TranslatedKeyEntity['langId'];
  userId: TranslatedKeyLog['userId'] | null;
  comment: TranslatedKeyEntity['comment'];
  value: TranslatedKeyEntity['comment'];
  timestamp: TranslatedKeyEntity['createdAt'];
}
