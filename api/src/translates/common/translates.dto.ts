import { PootleLangs } from '@common/enums/pootleLangs.enum';
import { Projects } from '@common/enums/projects.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetDictDTO {
  @IsOptional()
  @IsEnum(Projects)
  @ApiProperty({
    enum: Projects,
  })
  project: Projects;
}

export class ChangeKeyDTO {
  @IsNotEmpty()
  @IsEnum(PootleLangs)
  @ApiProperty({
    default: 'en',
    enum: PootleLangs,
  })
  lang: PootleLangs;

  @IsOptional()
  @IsEnum(Projects)
  @ApiProperty({
    default: 'services',
    enum: Projects,
  })
  project: Projects;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  key: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  value: string;
}
