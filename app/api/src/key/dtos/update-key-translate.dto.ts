import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKeyTranslateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  value: string;
}
