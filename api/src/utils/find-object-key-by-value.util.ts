export const findObjectKeyByValue = <T>(object: Record<string, T>, value: T): string => {
  return Object.keys(object).find((key) => {
    return object[key] === value;
  });
};
