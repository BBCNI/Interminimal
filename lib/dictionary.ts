import { TFatString, TString } from "./string";
import { NextCache } from "./nextCache";

type TDictionaryType = Record<string, TFatString | TDictionaryRoot> & {
  $$dict?: never;
};

/**
 * @category Dictionary
 */
export type TDictionaryMeta = Record<string, any>;

/**
 * The root of a translation dictionary
 *
 * @category Dictionary
 */
export type TDictionaryRoot = {
  /** the translations */
  $$dict: TDictionaryType;
  /** optional metadata - ignored by _Interminimal_ */
  $$meta?: TDictionaryMeta;
};

/**
 * Dictionary type guard: checks that an object looks like a dictionary.
 * Specifically does it have a `$$dict` key?
 *
 * @param d maybe a dictionary
 * @returns true if `d` looks like a dictionary
 */
export const isDictionary = (d: any): d is TDictionaryRoot =>
  d && typeof d === "object" && "$$dict" in d;

/**
 * @category Dictionary
 */
export const checkDictionary = (dictionary: any): void => {
  if (!isDictionary(dictionary))
    throw new Error(`Invalid dictionary (missing $$dict key)`);

  Object.values(dictionary.$$dict).map(ts =>
    isDictionary(ts) ? checkDictionary(ts) : TString.cast(ts)
  );
};

const canMerge = (obj: any): boolean =>
  obj && typeof obj === "object" && !Array.isArray(obj);

const mergeObj = (a: any, b: any): any => {
  if (canMerge(a) && canMerge(b))
    return Object.fromEntries(
      [...new Set([...Object.keys(a), ...Object.keys(b)])].map(key => {
        if (key in b) {
          if (key in a) return [key, merge(a[key], b[key])];
          return [key, b[key]];
        }
        return [key, a[key]];
      })
    );
  return b;
};

// Frozen dictionary merge
const merge = (a: TDictionaryRoot, b: TDictionaryRoot) =>
  Object.freeze(mergeObj(a, b));

/**
 * @category Dictionary
 */
export const nextDict = new NextCache<TDictionaryRoot>(merge);

/**
 * @category Dictionary
 */
export const rootDict: TDictionaryRoot = Object.freeze({ $$dict: {} });
