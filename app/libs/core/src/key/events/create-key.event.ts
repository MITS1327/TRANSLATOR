import { LangEntity } from '@translator/core/lang';

import { BaseEventImpl, KafkaEvent } from '@translator/messaging';

import { KeyEntity } from '../interfaces';

export type CreateKeyClientEventData = {
  keyName: KeyEntity['name'];
  projectId: KeyEntity['projectId'];
  values: {
    langName: LangEntity['name'];
    value: KeyEntity['value'];
  }[];
};

export class CreateKeyEvent extends BaseEventImpl<CreateKeyClientEventData> {
  override eventName = 'create_key';
}

export class CreateKeyKafkaEvent extends CreateKeyEvent implements KafkaEvent {
  getHeaders() {
    return {
      projectId: this.getData().projectId.toString(),
      eventName: this.eventName,
    };
  }

  getPartitionKey() {
    return JSON.stringify({
      projectId: this.getData().projectId.toString(),
    });
  }
}
