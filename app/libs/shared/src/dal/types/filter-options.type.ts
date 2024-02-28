import { BaseEntity } from '../../core';
import { GetOptionsWhere } from './get-options-where.type';

export type FilterOptions<T extends BaseEntity> = GetOptionsWhere<T> | GetOptionsWhere<T>[];
