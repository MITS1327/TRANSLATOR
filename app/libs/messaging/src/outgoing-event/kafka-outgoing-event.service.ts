import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_PROVIDER } from '@vpbx/shared';
import { firstValueFrom } from 'rxjs';

import { KafkaEvent, KafkaOutgoingEventService, OutgoingEventRepository } from './interfaces';
import { OUTGOING_EVENT_REPOSITORY_PROVIDER } from './outgoing-event.di-tokens';

@Injectable()
export class KafkaOutgoingEventServiceImpl implements KafkaOutgoingEventService {
  constructor(
    @Inject(OUTGOING_EVENT_REPOSITORY_PROVIDER) private readonly outgoingEventRepository: OutgoingEventRepository,
    @Inject(KAFKA_PROVIDER) private readonly kafkaClient: ClientKafka,
  ) {}

  private readonly DEFAULT_PATTERN = 'vpbx_events';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async emit(event: KafkaEvent, pattern: string = this.DEFAULT_PATTERN): Promise<void> {
    return firstValueFrom(
      this.kafkaClient.emit(pattern, {
        key: event.getPartitionKey(),
        headers: event.getHeaders(),
        value: event.getOutputObject(),
      }),
    );
  }

  async emitFromPersist(event: KafkaEvent): Promise<void> {
    await this.outgoingEventRepository.create({
      id: event.getId(),
      createdAt: event.getCreatedAt(),
      headers: event.getHeaders(),
      partitionKey: event.getPartitionKey(),
      data: event.getOutputObject() as unknown as Record<string, unknown>,
    });
  }
}
