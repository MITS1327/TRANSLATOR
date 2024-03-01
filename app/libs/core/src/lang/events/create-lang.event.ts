import { LangEntity } from '@translator/core/lang';

import { BaseEventImpl, KafkaEvent } from '@translator/messaging';

export type CreateLangClientEventData = {
  langName: LangEntity['name'];
  isTranslatable: LangEntity['isTranslatable'];
};

export const CREATE_LANG_EVENT_NAME = 'create_lang';

export class CreateLangEvent extends BaseEventImpl<CreateLangClientEventData> {
  override eventName = CREATE_LANG_EVENT_NAME;
}

export class CreateLangKafkaEvent extends CreateLangEvent implements KafkaEvent {
  getHeaders() {
    return {
      langName: this.getData().langName,
    };
  }

  getPartitionKey() {
    return JSON.stringify({
      langName: this.getData().langName,
    });
  }
}
