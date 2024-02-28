import { EventCreatedAt, EventId } from '../types';

export interface BaseEvent<T = unknown, S = unknown> {
  getData(): T;
  getId(): EventId;
  getType(): string;
  getCreatedAt(): EventCreatedAt;
  getOutputObject(): S;
}
