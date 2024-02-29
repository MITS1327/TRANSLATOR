import { GetDataWithFilterDTO } from '@common/dtos';

import { TranslatedKeyEntity } from '@translator/core/key';

export class GetTranslatedKeysWithFilterDTO extends GetDataWithFilterDTO<TranslatedKeyEntity> {}
