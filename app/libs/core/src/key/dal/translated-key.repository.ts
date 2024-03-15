import { InjectRepository } from '@nestjs/typeorm';

import { Readable } from 'stream';
import { FindOptionsWhere, Repository } from 'typeorm';
import { IsolationLevel, Transactional } from 'typeorm-transactional';

import { BaseRepositoryImpl, DeepPartial, FilterOptions } from '@translator/shared/dal';

import { TranslatedKeyEntity, TranslatedKeyRepository } from '../interfaces';
import { TranslatedKeyEntityImpl } from './translated-key.entity';

export class TranslatedKeyRepositoryImpl
  extends BaseRepositoryImpl<TranslatedKeyEntityImpl>
  implements TranslatedKeyRepository
{
  constructor(
    @InjectRepository(TranslatedKeyEntityImpl)
    private translatedKeyRepository: Repository<TranslatedKeyEntityImpl>,
  ) {
    super(translatedKeyRepository.target, translatedKeyRepository.manager);
  }

  private readonly DEFAULT_CHUNK_SIZE = 50;

  async updateOneByIdWithoutCheck(id: number, data: Partial<TranslatedKeyEntity>): Promise<void> {
    await this.translatedKeyRepository.update(id, data);
  }

  async updateManyByWithoutCheck(
    filter: FilterOptions<TranslatedKeyEntity>,
    data: Partial<TranslatedKeyEntity>,
  ): Promise<void> {
    await this.translatedKeyRepository.update(filter as FindOptionsWhere<TranslatedKeyEntity>, data);
  }

  getOneByIdAndLock(id: number): Promise<TranslatedKeyEntity> {
    return this.translatedKeyRepository.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write', tables: ['translated_key'] },
    });
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async createChunkedBulk(data: DeepPartial<TranslatedKeyEntity>[], chunkSize?: number): Promise<void> {
    const size = chunkSize || this.DEFAULT_CHUNK_SIZE;

    const chunks = data.reduce((acc, _, i) => (i % size ? acc : [...acc, data.slice(i, i + size)]), []);
    await Promise.all(chunks.map((chunk) => this.createBulk(chunk)));
  }

  getAllUniqueKeyNamesByProjectStream(): Promise<Readable> {
    return this.translatedKeyRepository
      .createQueryBuilder('translated_key')
      .select(['name', 'project_id', 'comment'])
      .distinctOn(['name', 'project_id'])
      .stream();
  }

  getAllByLangIdAndProjectIdStream(
    projectId: TranslatedKeyEntity['projectId'],
    langId: TranslatedKeyEntity['langId'],
  ): Promise<Readable> {
    return this.translatedKeyRepository
      .createQueryBuilder('translated_key')
      .where('translated_key.project_id = :projectId AND translated_key.lang_id = :langId', { projectId, langId })
      .select(['translated_key_id AS id', 'name', 'value', 'comment'])
      .stream();
  }
}
