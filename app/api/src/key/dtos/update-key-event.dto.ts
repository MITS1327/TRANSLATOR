import { ExternalTranslatorEventDTO } from '@common/dtos';
import { Type } from 'class-transformer';
import { Equals, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { UPDATE_KEY_EVENT_NAME } from '@translator/core/key/events';

class UpdateKeyEventDataDTO {
  @IsNotEmpty()
  @IsString()
  keyName: string;

  @IsNotEmpty()
  @IsString()
  langName: string;

  @IsNotEmpty()
  @IsString()
  keyValue: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @Equals(UPDATE_KEY_EVENT_NAME)
  eventName: typeof UPDATE_KEY_EVENT_NAME;

  @IsNotEmpty()
  @IsNumber()
  eventTs: number;
}

export class UpdateKeyEventDTO extends ExternalTranslatorEventDTO {
  @ValidateNested()
  @Type(() => UpdateKeyEventDataDTO)
  data: UpdateKeyEventDataDTO;
}
