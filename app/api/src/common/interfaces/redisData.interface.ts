import { Dict } from 'api/src/common/types/dict.type';

export interface RedisData {
  unixTime: string;
  filesData: Dict;
}
