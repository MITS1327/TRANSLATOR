import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;
}
