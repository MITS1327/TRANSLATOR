import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, NotEquals } from 'class-validator';

import { MAX_FILES_COUNT } from '../constants';

export class CreateProjectDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional({ each: true })
  @Transform(({ value }) => {
    if (!value) {
      return [];
    }

    return value.split(',').map((v: string) => +v.trim());
  })
  @NotEquals(0, { each: true })
  @IsNumber({}, { each: true })
  langsIdsToFilesAssociations?: number[] = [];

  @ApiPropertyOptional({
    description: 'Pootle files',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    maxItems: MAX_FILES_COUNT,
  })
  pootleFiles?: Express.Multer.File[];
}
