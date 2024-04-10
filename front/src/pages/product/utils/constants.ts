import { ProductSearchFieldSelectOptions } from '../types';

export const PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS: ProductSearchFieldSelectOptions = {
  name: {
    label: 'Ключ',
    value: 'name',
  },
  value: {
    label: 'Значение',
    value: 'value',
  },
  comment: {
    label: 'Комментарий',
    value: 'comment',
  },
};

export const DEFAULT_PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS = [
  PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS.name,
  PRODUCT_SEARCH_FIELDS_SELECT_OPTIONS.value,
];
