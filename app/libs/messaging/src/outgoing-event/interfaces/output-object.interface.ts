import { OutgoingEventTypeEnum } from '../enums';
import { EventData, EventId } from '../types';

export interface OutputObject<T extends EventData = EventData> {
  id: EventId;
  type: OutgoingEventTypeEnum;
  data: T;
}
