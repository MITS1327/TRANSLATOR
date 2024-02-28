import { type Provider } from '@nestjs/common';

import { OutgoingEventRepositoryImpl } from './dal';
import { KafkaOutgoingEventServiceImpl } from './kafka-outgoing-event.service';
import { KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER, OUTGOING_EVENT_REPOSITORY_PROVIDER } from './outgoing-event.di-tokens';

const outgoingEventRepositoryProvider: Provider = {
  provide: OUTGOING_EVENT_REPOSITORY_PROVIDER,
  useClass: OutgoingEventRepositoryImpl,
};

const kafkaOutgoingEventServiceProvider: Provider = {
  provide: KAFKA_OUTGOING_EVENT_SERVICE_PROVIDER,
  useClass: KafkaOutgoingEventServiceImpl,
};

export const PROVIDERS = [outgoingEventRepositoryProvider, kafkaOutgoingEventServiceProvider];
