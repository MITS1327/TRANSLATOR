import { LangEntity } from '@translator/core/lang';

import { BaseEventImpl, KafkaEvent } from '@translator/messaging';

import { TranslatedKeyEntity } from '../interfaces';

export type CreateKeyClientEventData = {
  keyName: TranslatedKeyEntity['name'];
  projectId: TranslatedKeyEntity['projectId'];
  values: {
    langName: LangEntity['name'];
    value: TranslatedKeyEntity['value'];
  }[];
};

export const CREATE_KEY_EVENT_NAME = 'create_key';

export class CreateKeyEvent extends BaseEventImpl<CreateKeyClientEventData> {
  override eventName = CREATE_KEY_EVENT_NAME;
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
