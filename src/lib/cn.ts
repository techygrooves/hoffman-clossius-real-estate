/**
 * Minimal class-name joiner. Deliberately dependency-free — we do not need
 * clsx/tailwind-merge for a static site of this size.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export const cn = (...values: ClassValue[]): string =>
  values
    .flat(Infinity as 1)
    .filter((v): v is string | number => v !== null && v !== undefined && v !== false && v !== '')
    .join(' ')
    .trim();
