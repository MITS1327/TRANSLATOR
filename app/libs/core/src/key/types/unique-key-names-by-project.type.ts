import { CamelToSnake } from '@translator/shared';

import { TranslatedKeyEntity } from '../interfaces';

type PickedTranslatedKeyEntity = Pick<TranslatedKeyEntity, 'name' | 'projectId' | 'comment'>;

export type UniqueKeyNamesByProject = {
  [Property in keyof PickedTranslatedKeyEntity as `${CamelToSnake<Property>}`]: PickedTranslatedKeyEntity[Property];
};
