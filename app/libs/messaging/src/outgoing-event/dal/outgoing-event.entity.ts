import { Column, Entity, PrimaryColumn } from 'typeorm';

import { OutgoingEventEntity } from '../interfaces';

@Entity('outgoing_event')
export class OutgoingEventEntityImpl implements OutgoingEventEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'outgoing_event_id',
    primaryKeyConstraintName: 'outgoing_event_pkey',
  })
  id: string;

  @Column('timestamp', { default: () => 'timezone(\'utc\'::text, now())' })
  createdAt: Date;

  @Column('jsonb', { default: () => '\'{}\'::jsonb' })
  headers: Record<string, string>;

  @Column('text', { name: 'partition_key' })
  partitionKey: string;

  @Column('jsonb', { default: () => '\'{}\'::jsonb' })
  data: Record<string, unknown>;
}
