import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@translator/shared/dal';

import { ProjectRepository } from '../interfaces';
import { ProjectEntityImpl } from './project.entity';

export class ProjectRepositoryImpl extends BaseRepositoryImpl<ProjectEntityImpl> implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectEntityImpl)
    private projectRepositoryRepository: Repository<ProjectEntityImpl>,
  ) {
    super(projectRepositoryRepository.target, projectRepositoryRepository.manager);
  }
}
