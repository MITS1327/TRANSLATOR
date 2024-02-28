import { ProjectEntity } from '@translator/core/project';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateKeyInputObject, GetKeysWithFilterInputObject, UpdateKeyInputObject } from '../input-objects';
import { GroupedKeysByLangName } from '../types';
import { KeyEntity } from './key.entity.interface';

export interface KeyService {
  getKeys(data: GetKeysWithFilterInputObject): Promise<GetDataWithFilterOutputObject<KeyEntity>>;
  getProjectKeysGroupedByLangName(projectId: ProjectEntity['id']): Promise<GroupedKeysByLangName>;
  createKey(data: CreateKeyInputObject): Promise<void>;
  updateKey(data: UpdateKeyInputObject): Promise<void>;
}
