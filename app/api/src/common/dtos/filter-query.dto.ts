import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { BaseEntity, FilterConditionEnum, FilterQueryInputObject } from '@translator/shared/core';

export class FilterQueryDTO<T extends BaseEntity> implements FilterQueryInputObject<T> {
  @IsString()
  @IsNotEmpty()
  field: keyof T;

  @IsEnum(FilterConditionEnum)
  operator: FilterConditionEnum;

  @IsString({ each: true })
  operands: string[];
}
