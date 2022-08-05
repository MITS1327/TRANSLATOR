export interface PootleFile {
  lang: string;
  data: string;
}

export interface Dict {
  [lang: string]: {
    [key: string]: string;
  }
}

export interface RedisData {
  hash: string;
  filesData: Dict;
}