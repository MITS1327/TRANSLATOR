import { KeyEntity } from '../interfaces';

export interface CreateKeyInputObject {
  name: KeyEntity['name'];
  projectId: KeyEntity['projectId'];
  userId: KeyEntity['userId'] | null;
  values?: Array<{
    langId: KeyEntity['langId'];
    value: KeyEntity['value'];
  }>;
}
