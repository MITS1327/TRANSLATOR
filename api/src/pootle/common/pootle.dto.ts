import { Projects } from '@common/enums/projects.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LangsFiles } from './langsFiles.enum';

export class UpdateDictsDTO {
  @IsNotEmpty()
  @IsEnum(Object.keys(Projects))
  @ApiProperty({
    enum: Object.keys(Projects),
  })
  project: keyof typeof Projects;

  @IsNotEmpty()
  @IsEnum(LangsFiles)
  @ApiProperty({
    enum: LangsFiles,
  })
  po_file: LangsFiles;
}
