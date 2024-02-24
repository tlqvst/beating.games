export const capitalize = (input: string): string =>
  input.at(0)?.toLocaleUpperCase() + input.slice(1, input.length);
