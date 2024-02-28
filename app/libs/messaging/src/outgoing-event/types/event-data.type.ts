import { EventName } from './event-name.type';
import { EventTs } from './event-ts.type';

export type EventData<T = unknown> = T & {
  eventName: EventName;
  eventTs: EventTs;
};
