import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ImportFromJSONDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  langId: number;

  @ApiProperty({
    description: 'Translated file',
    type: 'string',
    format: 'binary',
  })
  translatedFile: Express.Multer.File[];
}
