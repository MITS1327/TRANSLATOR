import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
