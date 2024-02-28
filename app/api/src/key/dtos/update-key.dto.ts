import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKeyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}
