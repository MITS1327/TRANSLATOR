import { GetDataWithFilterOutputObject } from '@translator/shared';

import { CreateLangInputObject, GetLangsWithFilterInputObject, UpdateLangInputObject } from '../input-objects';
import { LangEntity } from './lang.entity.interface';

export interface LangService {
  getLangs(data: GetLangsWithFilterInputObject): Promise<GetDataWithFilterOutputObject<LangEntity>>;
  createLang(data: CreateLangInputObject): Promise<void>;
  updateLang(data: UpdateLangInputObject): Promise<void>;
}
