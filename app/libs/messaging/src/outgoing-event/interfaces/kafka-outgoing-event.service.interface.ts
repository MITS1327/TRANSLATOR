import { BaseOutgoingEventService } from './base-outgoing-event.service.interface';
import { KafkaEvent } from './kafka.event.interface';

export interface KafkaOutgoingEventService extends BaseOutgoingEventService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: KafkaEvent, pattern?: any): Promise<void>;
  emitFromPersist(event: KafkaEvent): Promise<void>;
}
