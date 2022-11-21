import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LangsFiles } from './langsFiles.enum';

export class UpdateDictsDTO {
  @IsNotEmpty()
  @IsEnum(LangsFiles)
  @ApiProperty({
    enum: LangsFiles,
  })
  poFileName: LangsFiles;
}
