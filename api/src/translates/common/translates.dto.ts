import { Langs } from '@common/enums/langs.enum';
import { PootleLangs } from '@common/enums/pootleLangs.enum';
import { Projects } from '@common/enums/projects.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderByOptions, SortFieldsForNotTranslatedKeys } from './translates.enum';

export class GetDictDTO {
  @IsOptional()
  @IsEnum(Projects)
  @ApiPropertyOptional({
    enum: Projects,
  })
  project?: Projects;
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

export class GetNotTranslatedDictsDTO {
  @IsOptional()
  @IsEnum(Langs)
  @ApiPropertyOptional({
    enum: Langs,
  })
  lang?: Langs;

  @IsOptional()
  @IsEnum(Projects)
  @ApiPropertyOptional({
    enum: Projects,
  })
  project?: Projects;

  @IsOptional()
  @IsEnum(SortFieldsForNotTranslatedKeys)
  @ApiPropertyOptional({
    enum: SortFieldsForNotTranslatedKeys,
  })
  sortBy?: SortFieldsForNotTranslatedKeys;

  @IsOptional()
  @IsEnum(OrderByOptions)
  @ApiPropertyOptional({
    enum: OrderByOptions,
  })
  orderBy?: OrderByOptions;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 1,
  })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 25,
  })
  limitPerPage = 25;
}
