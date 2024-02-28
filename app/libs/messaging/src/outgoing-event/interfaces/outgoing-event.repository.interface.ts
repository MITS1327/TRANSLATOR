import { BaseRepository } from '@translator/shared/dal';

import { OutgoingEventEntity } from './outgoing-event.entity.interface';

export interface OutgoingEventRepository extends BaseRepository<OutgoingEventEntity> {}
