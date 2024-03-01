import { type Readable } from 'stream';

import { BaseRepository, DeepPartial, FilterOptions } from '@translator/shared/dal';

import { TranslatedKeyEntity } from './translated-key.entity.interface';

export interface TranslatedKeyRepository extends BaseRepository<TranslatedKeyEntity> {
  updateOneByIdWithoutCheck(id: TranslatedKeyEntity['id'], data: Partial<TranslatedKeyEntity>): Promise<void>;
  updateManyByWithoutCheck(
    filter: FilterOptions<TranslatedKeyEntity>,
    data: Partial<TranslatedKeyEntity>,
  ): Promise<void>;
  getOneByIdAndLock(id: TranslatedKeyEntity['id']): Promise<TranslatedKeyEntity>;
  getAllUniqueKeyNamesByProjectStream(): Promise<Readable>;
  createChunkedBulk(data: DeepPartial<TranslatedKeyEntity>[], chunkSize?: number): Promise<void>;
}
