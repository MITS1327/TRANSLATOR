import { ExternalTranslatorEventDTO } from '@common/dtos';
import { Type } from 'class-transformer';
import { Equals, IsNotEmpty, IsNumber, Matches, ValidateNested } from 'class-validator';

import { CREATE_LANG_EVENT_NAME } from '@translator/core/lang/events';

import { LOCALE_REGEX } from '@translator/api/lang/constants';

class CreateLangEventDataDTO {
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches(LOCALE_REGEX)
  langName: string;

  @IsNotEmpty()
  @Equals(CREATE_LANG_EVENT_NAME)
  eventName: typeof CREATE_LANG_EVENT_NAME;

  @IsNotEmpty()
  @IsNumber()
  eventTs: number;
}

export class CreateLangEventDTO extends ExternalTranslatorEventDTO {
  @ValidateNested()
  @Type(() => CreateLangEventDataDTO)
  data: CreateLangEventDataDTO;
}
