import { TFatString, TString } from "./string";
import { NextCache } from "./nextCache";

type TDictionaryType = {
  [key: string]: TFatString | TDictionaryRoot;
} & { $$dict?: never };

export type TDictionaryMeta = {
  [key: string]: string;
};

/**
 * The root of a translation dictionary
 */
export type TDictionaryRoot = {
  /** the translations */
  $$dict: TDictionaryType;
  /** optional metadata - ignored by _Interminimal_ */
  $$meta?: TDictionaryMeta;
};

export const checkDictionary = (dictionary: TDictionaryRoot): void => {
  if (!("$$dict" in dictionary))
    throw new Error(`Invalid dictionary (missing $$dict key)`);

  Object.values(dictionary.$$dict).map(ts =>
    "$$dict" in ts ? checkDictionary(ts as TDictionaryRoot) : TString.cast(ts)
  );
};

const canMerge = (obj: any): boolean =>
  obj && typeof obj === "object" && !Array.isArray(obj);

// Frozen dictionary merge
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

const merge = (a: any, b: any) => Object.freeze(mergeObj(a, b));

export const nextDict = new NextCache<TDictionaryRoot, TDictionaryRoot>(merge);
export const rootDict: TDictionaryRoot = Object.freeze({ $$dict: {} });
