import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, TransformFnParams } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import {
  BaseEntity,
  GetDataWithFilterInputObject,
  MAX_QUERY_LIMIT,
  MIN_QUERY_LIMIT,
  MIN_QUERY_OFFSET,
  OrderValue,
} from '@translator/shared/core';

import { transformToFilterQueryDTO } from '../functions';
import { FilterQueryDTO } from './filter-query.dto';

export class GetDataWithFilterDTO<T extends BaseEntity> implements GetDataWithFilterInputObject<T> {
  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @Max(MAX_QUERY_LIMIT)
  @Min(MIN_QUERY_LIMIT)
  @IsOptional()
  limit?: number = MAX_QUERY_LIMIT;

  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @Min(MIN_QUERY_OFFSET)
  @IsOptional()
  offset?: number = MIN_QUERY_OFFSET;

  @ApiPropertyOptional({
    name: 'filter',
    type: String,
    isArray: true,
    example: ['product||$eq||lk', 'createdAt||$between||2022-12-12,2023-12-12'],
  })
  @Transform(({ value }: { value: string | string[] }) => transformToFilterQueryDTO<T>(value))
  @IsDefined()
  @IsOptional()
  filter: FilterQueryDTO<T>[] = [];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  orderBy?: OrderValue;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  sortBy?: keyof T;
}
