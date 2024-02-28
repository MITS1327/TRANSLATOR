import { FilterConditionEnum } from '../enums';

export class FilterQueryInputObject<T> {
  field: keyof T;
  operator: FilterConditionEnum;
  operands: string[];
}
