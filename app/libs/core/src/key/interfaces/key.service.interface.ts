import { ProjectEntity } from '@translator/core/project';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import {
  CreateKeyInputObject,
  GetKeysWithFilterInputObject,
  UpdateKeyInputObject,
  UpdateTranslatedKeyInputObject,
} from '../input-objects';
import { GroupedTranslatedKeysByLangName } from '../types';
import { TranslatedKeyEntity } from './translated-key.entity.interface';

export interface KeyService {
  getTranslatedKeys(data: GetKeysWithFilterInputObject): Promise<GetDataWithFilterOutputObject<TranslatedKeyEntity>>;
  getTranslatedKeysGroupedByLangName(projectId: ProjectEntity['id']): Promise<GroupedTranslatedKeysByLangName>;
  createKey(data: CreateKeyInputObject): Promise<void>;
  updateKeyTranslate(data: UpdateTranslatedKeyInputObject): Promise<void>;
  updateKey(data: UpdateKeyInputObject): Promise<void>;
}
