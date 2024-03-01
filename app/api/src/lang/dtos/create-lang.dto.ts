import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { LOCALE_REGEX } from '../constants';

export class CreateLangDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(LOCALE_REGEX)
  name: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  isTranslatable: boolean = true;
}
