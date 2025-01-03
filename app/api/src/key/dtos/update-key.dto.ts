import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKeyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  projectId: number;
}
