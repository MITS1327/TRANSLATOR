export const convertEnumValuesToArray = <T>(initialEnum): T[] => {
  const isStringNumber = (value) => !isNaN(Number(value));

  return Object.keys(initialEnum)
    .filter((key: string) => isStringNumber(key))
    .map((key: string) => initialEnum[key]);
};
