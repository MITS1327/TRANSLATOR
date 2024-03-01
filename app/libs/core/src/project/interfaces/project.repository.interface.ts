import { BaseRepository } from '@translator/shared/dal';

import { ProjectEntity } from './project.entity.interface';

export interface ProjectRepository extends BaseRepository<ProjectEntity> {
  getOneByIdAndLock(id: ProjectEntity['id']): Promise<ProjectEntity>;
  getNextLangId(): Promise<number>;
  createFromPlainObject(data: ProjectEntity): Promise<void>;
}
