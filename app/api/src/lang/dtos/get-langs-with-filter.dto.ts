import { GetDataWithFilterDTO } from '@common/dtos';

import { LangEntity } from '@translator/core/lang';

export class GetLangsWithFilterDTO extends GetDataWithFilterDTO<LangEntity> {}
