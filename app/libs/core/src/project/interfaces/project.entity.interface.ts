import { BaseEntity } from '@translator/shared/core';

export interface ProjectEntity extends BaseEntity {
  id: number;
  name: string;
  keysCount: number;
}
