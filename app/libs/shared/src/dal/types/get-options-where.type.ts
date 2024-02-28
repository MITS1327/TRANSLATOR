import { BaseEntity } from '../../core/base.entity.interface';

/* eslint-disable no-use-before-define, @typescript-eslint/ban-types */

type GetOptionsWhereProperty<
  PropertyToBeNarrowed,
  Property = PropertyToBeNarrowed,
> = PropertyToBeNarrowed extends Promise<infer I extends BaseEntity>
  ? GetOptionsWhere<NonNullable<I>>
  : PropertyToBeNarrowed extends Array<infer I>
    ? GetOptionsWhereProperty<NonNullable<I>>
    : PropertyToBeNarrowed extends Function
      ? never
      : PropertyToBeNarrowed extends Buffer
        ? Property
        : PropertyToBeNarrowed extends Date
          ? Property
          : PropertyToBeNarrowed extends string
            ? Property
            : PropertyToBeNarrowed extends number
              ? Property
              : PropertyToBeNarrowed extends boolean
                ? Property
                : PropertyToBeNarrowed extends object
                  ? boolean
                  : Property;

export type GetOptionsWhere<T extends BaseEntity> = {
  [P in keyof T]?: P extends 'toString' ? unknown : GetOptionsWhereProperty<NonNullable<T[P]>>;
};
