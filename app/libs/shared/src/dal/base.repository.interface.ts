import { BaseEntity, FilterQueryInputObject, GetDataWithFilterOutputObject, OrderValue } from '../core';
import { DeepPartial, FilterOptions, OptionalDeepPartial } from './types';

export interface BaseRepository<T extends BaseEntity> {
  getOneById(id: T['id']): Promise<T | null>;
  getOneBy(filter: FilterOptions<T>): Promise<T>;
  getManyBy(filter: FilterOptions<T>): Promise<T[]>;
  getCountBy(filter: FilterOptions<T>): Promise<number>;
  getWithLimitAndOffset(
    filter: FilterOptions<T>,
    limit: number,
    offset: number,
    orderBy: OrderValue,
    sortBy: keyof T,
  ): Promise<GetDataWithFilterOutputObject<T>>;

  getAll(): Promise<T[]>;

  create(data: DeepPartial<T>): Promise<void>;
  createWithReturnedEntity(data: DeepPartial<T>): Promise<T>;
  createBulk(data: DeepPartial<T>[]): Promise<void>;

  updateOneBy(filter: FilterOptions<T>, data: OptionalDeepPartial<T>): Promise<void>;
  updateOneById(id: T['id'], data: OptionalDeepPartial<T>): Promise<void>;
  replaceById(id: T['id'], data: DeepPartial<T>): Promise<void>;

  filterBuilder(data: FilterQueryInputObject<T>[][]): FilterOptions<T>;

  deleteBy(filter: FilterOptions<T>): Promise<void>;
  deleteById(id: T['id'] | T['id'][]): Promise<void>;

  countBy(filter: FilterOptions<T>): Promise<number>;
}
