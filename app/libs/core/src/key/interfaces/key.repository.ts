import { BaseRepository } from '@translator/shared/dal';

import { KeyEntity } from './key.entity.interface';

export interface KeyRepository extends BaseRepository<KeyEntity> {
  updateOneByIdWithoutCheck(id: KeyEntity['id'], data: Partial<KeyEntity>): Promise<void>;
}
