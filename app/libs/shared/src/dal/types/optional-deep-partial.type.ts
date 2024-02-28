import { BaseEntity } from '../../core/base.entity.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */

type _OptionalDeepPartial<T> = {
  [P in keyof T]?:
    | (T[P] extends Array<infer U>
        ? Array<_OptionalDeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
          ? ReadonlyArray<_OptionalDeepPartial<U>>
          : _OptionalDeepPartial<T[P]>)
    | (() => string);
};

export type OptionalDeepPartial<T extends BaseEntity> = _OptionalDeepPartial<
  Record<string, any> extends T ? unknown : T
>;
