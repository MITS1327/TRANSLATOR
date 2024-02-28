import { Inject, Injectable } from '@nestjs/common';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateProjectInputObject, GetProjectsWithFilterInputObject, UpdateProjectInputObject } from './input-objects';
import { ProjectEntity, ProjectRepository, ProjectService } from './interfaces';
import { PROJECT_REPOSITORY_PROVIDER } from './project.di-tokens';

@Injectable()
export class ProjectServiceImpl implements ProjectService {
  constructor(@Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository) {}

  async getProjects(data: GetProjectsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<ProjectEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.projectRepository.filterBuilder(filter);

    return this.projectRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  async createProject(data: CreateProjectInputObject): Promise<void> {
    await this.projectRepository.create({
      ...data,
      keysCount: 0,
    });
  }

  async updateProject(data: UpdateProjectInputObject): Promise<void> {
    await this.projectRepository.updateOneById(data.id, data);
  }
}
