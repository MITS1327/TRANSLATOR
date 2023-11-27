import { Dict } from '@common/types/dict.type';

export interface RedisData {
  unixTime: string;
  filesData: Dict;
}
