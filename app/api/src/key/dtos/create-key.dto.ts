import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, NotEquals, ValidateIf, ValidateNested } from 'class-validator';

class KeyValueDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  langId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateKeyDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  projectId: number;

  @ApiPropertyOptional()
  @NotEquals(null)
  @IsArray()
  @ValidateNested()
  @ValidateIf((object, value) => value !== undefined)
  @Type(() => KeyValueDTO)
  values?: Array<KeyValueDTO>;
}
