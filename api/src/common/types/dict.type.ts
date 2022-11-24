import { Langs } from '@common/enums/langs.enum';
import { LangDict } from '@common/interfaces/langDict.interface';

export type Dict = Record<keyof typeof Langs, LangDict>;
