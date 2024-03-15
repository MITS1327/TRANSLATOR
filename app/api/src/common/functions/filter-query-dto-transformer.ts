import { BadRequestException } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { BaseEntity, FilterConditionEnum } from '@translator/shared/core';

import { FilterQueryDTO } from '../dtos';

const transformValue = <T extends BaseEntity>(value: string) => {
  const [field,
    operator,
    ...operands] = [
    ...value.split('||').slice(0, -1),
    ...value.split('||').slice(-1)[0].split(','),
  ];

  if (!(field && operator && operands?.length)) {
    throw new BadRequestException('Failed to recognize filter');
  }

  return plainToInstance(FilterQueryDTO<T>, {
    field,
    operator: Object(FilterConditionEnum)[operator.toUpperCase()] as FilterConditionEnum,
    operands,
  });
};

export const transformToFilterQueryDTO = <T extends BaseEntity>(value: string | string[]) => {
  const mappedValue = value instanceof Array ? [...value] : [value];

  const FILTER_OR_DELIMITER = 'OR';

  return mappedValue.reduce(
    (acc, val) => {
      if (val === FILTER_OR_DELIMITER) {
        return [...acc, []];
      }

      acc[acc.length - 1].push(transformValue<T>(val));

      return acc;
    },
    [[]],
  );
};
