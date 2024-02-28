# Usage outgoing-event module

Event

```ts
import { BaseEventImpl, KafkaEvent, OutgoingEventTypeEnum } from '@translator/messaging/outgoing-event';

export interface AnyClientEventData {
  testField: string;
}
export class AnyEvent extends BaseEventImpl<AnyClientEventData> {
  override eventName = EVENT_NAME;
}

export class AnyKafkaEvent extends AnyEvent implements KafkaEvent {
  getHeaders() {
    return {
      accountId: this.getData().accountId.toString(),
    };
  }

  getPartitionKey() {
    return this.getData().accountId.toString();
  }
}

```

Module
```ts

import { OutgoingEventModule } from '@translator/messaging/outgoing-event';

@Module({
  imports: [...otherImports, OutgoingEventModule],
  ...
})
export class AnyModule {}

```

Service

Use DI_TOKEN from outgoing-event from outgoing-event.di-tokens.ts with postfixe 'SERVICE'

If you use ```emitFromPersist``` function and you want to save other data in your persist layer, need to use transaction for this

If you use ```emit``` function and you save other data in your persist layer, you  must be careful with this logic, because you may be
emit event to message broker, but not save date, this may cause bugs in business logic.

Recomend to use ```emit``` with message broker with commit functionality.
Flow: app read message broker -> do any manipulation with read message -> emit to another message broker -> commit

```ts
import { OutgoingEventService } from '@translator/messaging/outgoing-event';
...

export class AnyService {
  constructor(
    @Inject(DI_TOKEN)
    private readonly outgoingEventService: OutgoingEventService,
  ) { }

  @Transactional(ISOLATION_LEVEL)
  public async anyMethod() {
    await this.outgoingEventService.emitFromPersist(
      new AnyKafkaEvent(OutgoingEventTypeEnum.NOTIFICATION, { testField: 'testField' }),
    );
  }

  public async secondAnyMethod() {
    await this.outgoingEventService.emit(
      new AnyKafkaEvent(OutgoingEventTypeEnum.NOTIFICATION, { testField: 'testField' }),
    );
  }
}
```
