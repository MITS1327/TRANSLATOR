import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { ProjectEntity, ProjectRepository } from '../interfaces';
import { ProjectEntityImpl } from './project.entity';

export class ProjectRepositoryImpl extends BaseRepositoryImpl<ProjectEntityImpl> implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectEntityImpl)
    private projectRepository: Repository<ProjectEntityImpl>,
  ) {
    super(projectRepository.target, projectRepository.manager);
  }

  getOneByIdAndLock(id: number): Promise<ProjectEntity> {
    return this.projectRepository.findOne({ where: { id }, lock: { mode: 'pessimistic_write', tables: ['project'] } });
  }

  async createFromPlainObject(data: ProjectEntity): Promise<void> {
    await this.repo.query('INSERT INTO translator.project (project_id, name, keys_count) VALUES ($1, $2, $3)', [
      data.id,
      data.name,
      data.keysCount,
    ]);
  }

  async getNextLangId(): Promise<number> {
    const [{ next_val }] = await this.projectRepository.query(
      'SELECT nextval(\'translator.project_project_id_seq\'::regclass) AS next_val',
    );

    return next_val;
  }
}
