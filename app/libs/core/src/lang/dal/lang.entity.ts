import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { LangEntity } from '../interfaces';

@Entity('lang')
export class LangEntityImpl implements LangEntity {
  @PrimaryGeneratedColumn({
    name: 'lang_id',
    primaryKeyConstraintName: 'lang_id_pkey',
  })
  id: number;

  @Index('unq_lang_name', { unique: true })
  @Column('text')
  name: string;
}
