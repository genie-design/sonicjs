export function singularize(word: string) {
  if (word === 'sizes') {
    return 'size';
  }
  if (word.endsWith('ses') || word.endsWith('xes') || word.endsWith('zes')) {
    return word.slice(0, -3);
  }
  if (word.endsWith('shes') || word.endsWith('ches')) {
    return word.slice(0, -4);
  }

  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  }

  return word.slice(0, -1);
}
export const camelize = <T extends string>(input: T) =>
  input.toLocaleLowerCase() as Camelize<T>;

export const pascalize = <T extends string>(input: T) =>
  (input.length
    ? `${input[0]!.toLocaleUpperCase()}${
        input.length > 1 ? input.slice(1, input.length) : ''
      }`
    : input) as Pascalize<T>;

export type Camelize<T extends string> = Lowercase<T>;

export type Pascalize<T extends string> = Capitalize<Lowercase<T>>;
