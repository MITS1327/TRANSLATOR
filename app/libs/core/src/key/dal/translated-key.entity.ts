import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LangEntity, LangEntityImpl } from '@translator/core/lang';
import { ProjectEntity, ProjectEntityImpl } from '@translator/core/project';

import { TranslatedKeyEntity, TranslatedKeyLog } from '../interfaces';

@Index('unique_name_project_id_lang_id', ['name', 'projectId', 'langId'], { unique: true })
@Entity('translated_key')
export class TranslatedKeyEntityImpl implements TranslatedKeyEntity {
  @PrimaryGeneratedColumn({
    name: 'translated_key_id',
    primaryKeyConstraintName: 'translated_key_id_pkey',
  })
  id: number;

  @Index('translated_key_name_index', { synchronize: false })
  @Column('text')
  name: string;

  @Index('translated_key_lang_id_index')
  @Column('int')
  langId: number;

  @Index('translated_key_project_id_index')
  @Column('int')
  projectId: number;

  @Index('translated_key_value_index', { synchronize: false })
  @Column('text')
  value: string;

  @Column('timestamp', { default: () => 'timezone(\'utc\'::text, now())' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'timezone(\'utc\'::text, now())' })
  updatedAt: Date;

  @Column('jsonb')
  logs: TranslatedKeyLog[];

  @Column('text', { nullable: true })
  comment: string | null;

  @ManyToOne(() => LangEntityImpl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lang_id', foreignKeyConstraintName: 'translated_key_lang_id_fkey' })
  lang: LangEntity;

  @ManyToOne(() => ProjectEntityImpl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id', foreignKeyConstraintName: 'translated_key_project_id_fkey' })
  project: ProjectEntity;
}
