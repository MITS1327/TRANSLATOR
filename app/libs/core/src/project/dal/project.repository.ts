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
}
