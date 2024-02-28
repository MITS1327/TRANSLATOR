import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { KeyRepository } from '../interfaces';
import { KeyEntityImpl } from './key.entity';

export class KeyRepositoryImpl extends BaseRepositoryImpl<KeyEntityImpl> implements KeyRepository {
  constructor(
    @InjectRepository(KeyEntityImpl)
    private keyRepository: Repository<KeyEntityImpl>,
  ) {
    super(keyRepository.target, keyRepository.manager);
  }
}
