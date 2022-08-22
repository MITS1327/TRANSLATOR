import { Projects } from '@common/enums/projects.enum';

export type ProductsHash = {
  [key in Projects]: string;
};
