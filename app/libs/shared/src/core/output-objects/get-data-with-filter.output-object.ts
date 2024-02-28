import { BaseEntity } from '../base.entity.interface';

export interface GetDataWithFilterOutputObject<T extends BaseEntity> {
  data: T[];
  limit: number;
  offset: number;
  totalCount: number;
}
