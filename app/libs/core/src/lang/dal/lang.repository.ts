import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { LangRepository } from '../interfaces';
import { LangEntityImpl } from './lang.entity';

export class ProjectRepositoryImpl extends BaseRepositoryImpl<LangEntityImpl> implements LangRepository {
  constructor(
    @InjectRepository(LangEntityImpl)
    private langRepository: Repository<LangEntityImpl>,
  ) {
    super(langRepository.target, langRepository.manager);
  }
}
