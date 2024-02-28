import { BaseEntity } from '@vpbx/shared';

export interface OutgoingEventEntity extends BaseEntity {
  id: string;
  createdAt: Date;
  headers: Record<string, string>;
  partitionKey: string;
  data: Record<string, unknown>;
}
