import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, NotEquals, ValidateIf, ValidateNested } from 'class-validator';

class KeyValueDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  langId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  value: string;
}

export class CreateKeyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  comment: string;

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
