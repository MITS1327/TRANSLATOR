import { Equals, IsNotEmpty, IsUUID } from 'class-validator';

import { OutgoingEventTypeEnum } from '@translator/messaging';

export class ExternalTranslatorEventDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @Equals(OutgoingEventTypeEnum.EXTERNAL)
  type: OutgoingEventTypeEnum.EXTERNAL;

  data: unknown;
}
