import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LangEntity, LangEntityImpl } from '@translator/core/lang';
import { ProjectEntity, ProjectEntityImpl } from '@translator/core/project';

import { KeyEntity } from '../interfaces';

@Index('unique_name_project_id_lang_id', ['name', 'projectId', 'langId'], { unique: true })
@Entity('key')
export class KeyEntityImpl implements KeyEntity {
  @PrimaryGeneratedColumn({
    name: 'key_id',
    primaryKeyConstraintName: 'key_id_pkey',
  })
  id: number;

  @Column('text')
  name: string;

  @Column('int')
  langId: number;

  @Column('int')
  projectId: number;

  @Column('text')
  value: string;

  @Column('timestamp', { default: () => 'timezone(\'utc\'::text, now())' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'timezone(\'utc\'::text, now())' })
  updatedAt: Date;

  @Column('bigint', { nullable: true })
  userId: string;

  @ManyToOne(() => LangEntityImpl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lang_id', foreignKeyConstraintName: 'key_lang_id_fkey' })
  lang: LangEntity;

  @ManyToOne(() => ProjectEntityImpl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id', foreignKeyConstraintName: 'key_project_id_fkey' })
  project: ProjectEntity;
}
