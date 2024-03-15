import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { QueryProjectRepository } from '../interfaces';
import { QueryProjectEntityImpl } from './query-project.entity';

export class QueryProjectRepositoryImpl
  extends BaseRepositoryImpl<QueryProjectEntityImpl>
  implements QueryProjectRepository
{
  constructor(
    @InjectRepository(QueryProjectEntityImpl)
    private queryProjectRepository: Repository<QueryProjectEntityImpl>,
  ) {
    super(queryProjectRepository.target, queryProjectRepository.manager);
  }
}
