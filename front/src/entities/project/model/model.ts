import { Lang } from 'entities/lang';

export interface Project {
  id: number;
  name: string;
  keysCount: number;
  untranslatedKeysByLang: Record<Lang['name'], string>;
}
