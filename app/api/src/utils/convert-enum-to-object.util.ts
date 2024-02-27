export const convertEnumToObject = <T>(initialEnum): Record<string, T> => {
  return Object.entries(initialEnum).reduce((previousValue, currentValue) => {
    return { ...previousValue, [currentValue[0]]: currentValue[1] };
  }, {});
};
