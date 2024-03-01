import { Inject, Injectable } from '@nestjs/common';

import { GetDataWithFilterOutputObject } from '@translator/shared';

import { LANG_SERVICE_PROVIDER, LangService } from '../lang';
import { CreateProjectInputObject, GetProjectsWithFilterInputObject, UpdateProjectInputObject } from './input-objects';
import { ProjectEntity, ProjectRepository, ProjectService } from './interfaces';
import { PROJECT_REPOSITORY_PROVIDER } from './project.di-tokens';

@Injectable()
export class ProjectServiceImpl implements ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY_PROVIDER) private readonly projectRepository: ProjectRepository,
    @Inject(LANG_SERVICE_PROVIDER) private readonly langService: LangService,
  ) {}

  async getProjects(data: GetProjectsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<ProjectEntity>> {
    const { limit, offset, sortBy, orderBy, filter } = data;
    const additionalFilter = this.projectRepository.filterBuilder(filter);

    return this.projectRepository.getWithLimitAndOffset(additionalFilter, limit, offset, orderBy, sortBy);
  }

  async createProject(data: CreateProjectInputObject): Promise<void> {
    await this.langService.isLangCreateInProgressOrThrow();
    await this.projectRepository.create({
      ...data,
      keysCount: 0,
    });
  }

  async updateProject(data: UpdateProjectInputObject): Promise<void> {
    await this.projectRepository.updateOneById(data.id, data);
  }
}
