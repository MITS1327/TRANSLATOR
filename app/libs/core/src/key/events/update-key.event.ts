import { LangEntity } from '@translator/core/lang';

import { BaseEventImpl, KafkaEvent } from '@translator/messaging';

import { KeyEntity } from '../interfaces';

export type UpdateKeyClientEventData = {
  keyName: KeyEntity['name'];
  keyValue: KeyEntity['value'];
  projectId: KeyEntity['projectId'];
  langName: LangEntity['name'];
};

export class UpdateKeyEvent extends BaseEventImpl<UpdateKeyClientEventData> {
  override eventName = 'update_key';
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
