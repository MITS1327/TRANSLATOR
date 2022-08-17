export interface PootleFile {
  lang: string;
  data: string;
}

export interface Dict {
  [lang: string]: {
    [key: string]: string;
  };
}
