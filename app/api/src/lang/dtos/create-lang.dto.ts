import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, Matches } from 'class-validator';

import { LOCALE_REGEX } from '../constants';

export class CreateLangDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(LOCALE_REGEX)
  name: string;
}
