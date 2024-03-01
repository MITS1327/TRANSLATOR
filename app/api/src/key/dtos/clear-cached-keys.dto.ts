import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClearCachedKeysDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  projectId: number;
}
