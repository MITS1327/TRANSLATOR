import { BaseRepository } from '@translator/shared/dal';

import { ProjectEntity } from './project.entity.interface';

export interface ProjectRepository extends BaseRepository<ProjectEntity> {
  getByIdAndLock(id: ProjectEntity['id']): Promise<ProjectEntity>;
}