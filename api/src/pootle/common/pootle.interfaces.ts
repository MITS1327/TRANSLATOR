import { Projects } from '@common/enums/projects.enum';
import { Dict } from '@common/types/dict.type';

export interface GetFileRO {
  project: keyof typeof Projects;
  data: Dict;
}
