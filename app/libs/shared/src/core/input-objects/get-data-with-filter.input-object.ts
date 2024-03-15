import { OrderValue } from '../types';
import { FilterQueryInputObject } from './filter-query.input-object';

export interface GetDataWithFilterInputObject<T> {
  limit?: number;
  offset?: number;
  filter: FilterQueryInputObject<T>[][];
  orderBy?: OrderValue;
  sortBy?: keyof T;
}
