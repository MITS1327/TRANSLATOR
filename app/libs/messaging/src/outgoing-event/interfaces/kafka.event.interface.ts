import { BaseEvent } from './base.event.interface';

export interface KafkaEvent<T = unknown, S = unknown> extends BaseEvent<T, S> {
  getPartitionKey(): string;
  getHeaders(): Record<string, string>;
}
