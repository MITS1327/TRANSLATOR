import { Projects } from 'api/src/common/enums/projects.enum';
import { Dict } from 'api/src/common/types/dict.type';

export interface GetFileRO {
  project: keyof typeof Projects;
  data: Dict;
}
