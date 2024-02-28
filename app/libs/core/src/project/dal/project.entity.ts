import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectEntity } from '../interfaces';

@Entity('project')
export class ProjectEntityImpl implements ProjectEntity {
  @PrimaryGeneratedColumn({
    name: 'project_id',
    primaryKeyConstraintName: 'project_id_pkey',
  })
  id: number;

  @Column('text')
  name: string;

  @Column('int')
  keysCount: number;
}
