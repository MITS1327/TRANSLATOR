import { BadRequestException } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { BaseEntity, FilterConditionEnum } from '@translator/shared/core';

import { FilterQueryDTO } from '../dtos';

export const transformToFilterQueryDTO = <T extends BaseEntity>(value: string | string[]) => {
  value = value instanceof Array ? [...value] : [value];

  return value.map((val) => {
    const [field,
      operator,
      ...operands] = [
      ...val.split('||').slice(0, -1),
      ...val.split('||').slice(-1)[0].split(','),
    ];

    if (!(field && operator && operands?.length)) {
      throw new BadRequestException('Failed to recognize filter');
    }

    return plainToInstance(FilterQueryDTO<T>, {
      field,
      operator: Object(FilterConditionEnum)[operator.toUpperCase()] as FilterConditionEnum,
      operands,
    });
  });
};
