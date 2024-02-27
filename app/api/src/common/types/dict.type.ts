import { Langs } from 'api/src/common/enums/langs.enum';
import { LangDict } from 'api/src/common/interfaces/langDict.interface';

export type Dict = Record<keyof typeof Langs, LangDict>;
