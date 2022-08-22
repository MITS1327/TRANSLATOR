import { RedisData } from '@common/interfaces/redisData.interface';

export interface PootleFile {
  lang: string;
  data: string;
}

export interface Dict {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface GetDictsRO extends RedisData {
  projectName: string;
}
