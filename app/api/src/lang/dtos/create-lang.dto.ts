import { ApiProperty } from '@nestjs/swagger';

import { IsLocale, IsNotEmpty, Matches } from 'class-validator';

import { LOCALE_REGEX } from '../constants';

export class CreateLangDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsLocale()
  @Matches(LOCALE_REGEX)
  name: string;
}
