import { BaseRepository } from '@translator/shared/dal';

import { QueryProjectEntity } from './query-project.entity.interface';

export interface QueryProjectRepository
  extends Pick<
    BaseRepository<QueryProjectEntity>,
    | 'getAll'
    | 'getCountBy'
    | 'getManyBy'
    | 'getOneBy'
    | 'getOneById'
    | 'getWithLimitAndOffset'
    | 'countBy'
    | 'filterBuilder'
  > {}
