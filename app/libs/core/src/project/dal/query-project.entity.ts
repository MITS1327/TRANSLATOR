import { ViewColumn, ViewEntity } from 'typeorm';

import { QueryProjectEntity, UntranslatedKeysByLang } from '../interfaces';

@ViewEntity('query_project')
export class QueryProjectEntityImpl implements QueryProjectEntity {
  @ViewColumn({
    name: 'project_id',
  })
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  keysCount: number;

  @ViewColumn()
  untranslatedKeysByLang: UntranslatedKeysByLang;
}
