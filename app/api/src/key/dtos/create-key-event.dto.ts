import { ExternalTranslatorEventDTO } from '@common/dtos';
import { Type } from 'class-transformer';
import { Equals, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { CREATE_KEY_EVENT_NAME } from '@translator/core/key/events';

class CreateKeyValueDTO {
  @IsNotEmpty()
  @IsString()
  langName: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

class CreateKeyEventDataDTO {
  @IsNotEmpty()
  @IsString()
  keyName: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateKeyValueDTO)
  @ValidateNested()
  values: CreateKeyValueDTO[];

  @IsNotEmpty()
  @Equals(CREATE_KEY_EVENT_NAME)
  eventName: typeof CREATE_KEY_EVENT_NAME;

  @IsNotEmpty()
  @IsNumber()
  eventTs: number;
}

export class CreateKeyEventDTO extends ExternalTranslatorEventDTO {
  @ValidateNested()
  @Type(() => CreateKeyEventDataDTO)
  data: CreateKeyEventDataDTO;
}
