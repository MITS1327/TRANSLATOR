import { TranslatedKeyEntity, TranslatedKeyLog } from '../interfaces';

export interface UpdateTranslatedKeyInputObject {
  id: TranslatedKeyEntity['id'];
  value: TranslatedKeyEntity['value'];
  userId: TranslatedKeyLog['userId'] | null;
}
