import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { KeyEntity, KeyRepository } from '../interfaces';
import { KeyEntityImpl } from './key.entity';

export class KeyRepositoryImpl extends BaseRepositoryImpl<KeyEntityImpl> implements KeyRepository {
  constructor(
    @InjectRepository(KeyEntityImpl)
    private keyRepository: Repository<KeyEntityImpl>,
  ) {
    super(keyRepository.target, keyRepository.manager);
  }

  async updateOneByIdWithoutCheck(id: number, data: Partial<KeyEntity>): Promise<void> {
    await this.keyRepository.update(id, data);
  }
}
