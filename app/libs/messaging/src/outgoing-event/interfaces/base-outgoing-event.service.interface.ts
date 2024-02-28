import { BaseEvent } from './base.event.interface';

/*
  NOTE:
    emit used for sending events to the message broker,
    emitFromPersist used for sending events to the message broker from the persist layer
*/
export interface BaseOutgoingEventService {
  emit(event: BaseEvent, pattern?: string): Promise<void>;
  emitFromPersist(event: BaseEvent): Promise<void>;
}
