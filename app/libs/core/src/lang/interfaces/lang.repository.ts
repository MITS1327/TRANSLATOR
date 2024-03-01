import { BaseRepository } from '@translator/shared/dal';

import { LangEntity } from './lang.entity.interface';

export interface LangRepository extends BaseRepository<LangEntity> {
  getNextLangId(): Promise<number>;
  createFromPlainObject(data: LangEntity): Promise<void>;
}
