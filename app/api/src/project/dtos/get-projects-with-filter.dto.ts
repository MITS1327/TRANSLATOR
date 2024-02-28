import { GetDataWithFilterDTO } from '@common/dtos';

import { ProjectEntity } from '@translator/core/project';

export class GetProjectsWithFilterDTO extends GetDataWithFilterDTO<ProjectEntity> {}
