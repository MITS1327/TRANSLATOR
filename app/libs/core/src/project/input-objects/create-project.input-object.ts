import { ProjectEntity } from '../interfaces';

export interface CreateProjectInputObject {
  name: ProjectEntity['name'];
  userId: string | null;
  langFiles?: {
    langId: number;
    path: string;
  }[];
}
