import { randomUUID } from 'crypto';

import { OutgoingEventTypeEnum } from '../enums';
import { BaseEvent, OutputObject } from '../interfaces';
import { EventCreatedAt, EventData, EventId, EventName } from '../types';

export abstract class BaseEventImpl<T = unknown> implements BaseEvent<T, OutputObject<EventData<T>>> {
  readonly #id = null;
  readonly #createdAt = null;
  abstract eventName: EventName;

  constructor(
    protected readonly eventType: OutgoingEventTypeEnum,
    protected readonly data: T,
    createdAt?: Date,
  ) {
    this.#id = randomUUID();
    this.#createdAt = createdAt || new Date();
  }

  getId(): EventId {
    return this.#id;
  }

  getType(): OutgoingEventTypeEnum {
    return this.eventType;
  }

  getCreatedAt(): EventCreatedAt {
    return this.#createdAt;
  }

  getData(): EventData<T> {
    return {
      ...this.data,
      eventName: this.eventName,
      eventTs: this.getCreatedAt().getTime(),
    };
  }

  getOutputObject(): OutputObject<EventData<T>> {
    return {
      id: this.getId(),
      type: this.eventType,
      data: this.getData(),
    };
  }
}
