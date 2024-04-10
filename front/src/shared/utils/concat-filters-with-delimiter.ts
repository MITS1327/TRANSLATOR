import { ConcatFilterDelimitersEnum } from "shared/types";

export const concatFiltersWithDelimiter = (
  filters: string[],
  delimiter: ConcatFilterDelimitersEnum,
  commonFilters: string[] = []
): string[] => {
  if (!filters?.length) {
    return commonFilters;
  }

  return filters.reduce(
    (acc, filter, index) => ([...acc, ...(!index ? [] : [delimiter]), ...commonFilters, filter]), []
  );
};