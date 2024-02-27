import { ApiProperty } from '@nestjs/swagger';

import { Projects } from 'api/src/common/enums/projects.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { LangsFiles } from './langsFiles.enum';

export class UpdateDictsParams {
  @IsNotEmpty()
  @IsEnum(Object.keys(Projects))
  @ApiProperty({
    enum: Object.keys(Projects),
  })
  project: keyof typeof Projects;
}

export class UpdateDictsDTO {
  @IsNotEmpty()
  @IsEnum(LangsFiles)
  @ApiProperty({
    enum: LangsFiles,
  })
  poFileName: LangsFiles;
}
