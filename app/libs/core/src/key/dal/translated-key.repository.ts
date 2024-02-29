import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';

import { BaseRepositoryImpl, FilterOptions } from '@translator/shared/dal';

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
}
