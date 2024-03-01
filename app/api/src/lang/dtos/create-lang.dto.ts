import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { LOCALE_REGEX } from '../constants';

export class CreateLangDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(LOCALE_REGEX)
  name: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isTranslatable: boolean = true;
}
