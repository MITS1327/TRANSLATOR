import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateProjectInputObject, GetProjectsWithFilterInputObject, UpdateProjectInputObject } from '../input-objects';
import { ProjectEntity } from './project.entity.interface';

export interface ProjectService {
  getProjects(data: GetProjectsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<ProjectEntity>>;
  createProject(data: CreateProjectInputObject): Promise<void>;
  updateProject(data: UpdateProjectInputObject): Promise<void>;
}
