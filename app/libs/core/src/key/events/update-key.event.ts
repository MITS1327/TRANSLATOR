import { LangEntity } from '@translator/core/lang';

import { BaseEventImpl, KafkaEvent } from '@translator/messaging';

import { TranslatedKeyEntity } from '../interfaces';

export type UpdateKeyClientEventData = {
  keyName: TranslatedKeyEntity['name'];
  keyValue: TranslatedKeyEntity['value'];
  projectId: TranslatedKeyEntity['projectId'];
  langName: LangEntity['name'];
};

export const UPDATE_KEY_EVENT_NAME = 'update_key';

export class UpdateKeyEvent extends BaseEventImpl<UpdateKeyClientEventData> {
  override eventName = UPDATE_KEY_EVENT_NAME;
}

export class UpdateKeyKafkaEvent extends UpdateKeyEvent implements KafkaEvent {
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
