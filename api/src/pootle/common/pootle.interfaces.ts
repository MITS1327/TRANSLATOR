import { Projects } from '@common/enums/projects.enum';
import { Dict } from '@common/interfaces/dict.interface';

export interface GetFileRO {
  project: keyof typeof Projects;
  data: Dict;
}
