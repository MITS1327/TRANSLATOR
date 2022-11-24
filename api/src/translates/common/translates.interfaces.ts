import { Langs } from '@common/enums/langs.enum';
import { Projects } from '@common/enums/projects.enum';
import { RedisData } from '@common/interfaces/redisData.interface';

export interface PootleFile {
  lang: string;
  data: string;
}

export interface GetDictsRO extends RedisData {
  projectName: string;
}

export interface NotTranslatedDictsRO {
  count: number;
  keys: string[];
}

export interface NotTranslatedKey {
  key: string;
  lang: Langs;
  project: Projects;
}
