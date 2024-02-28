import { ProjectEntity } from '../interfaces';
import { CreateProjectInputObject } from './create-project.input-object';

export type UpdateProjectInputObject = Partial<CreateProjectInputObject> & {
  id: ProjectEntity['id'];
};
