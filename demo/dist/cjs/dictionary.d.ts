import { TFatString } from "./string";
import { NextCache } from "./nextCache";
declare type TDictionaryType = {
    [key: string]: TFatString | TDictionaryRoot;
} & {
    $$dict?: never;
};
/**
 * @category Dictionary
 */
export declare type TDictionaryMeta = {
    [key: string]: string;
};
/**
 * The root of a translation dictionary
 *
 * @category Dictionary
 */
export declare type TDictionaryRoot = {
    /** the translations */
    $$dict: TDictionaryType;
    /** optional metadata - ignored by _Interminimal_ */
    $$meta?: TDictionaryMeta;
};
/**
 * @category Dictionary
 */
export declare const checkDictionary: (dictionary: TDictionaryRoot) => void;
/**
 * @category Dictionary
 */
export declare const nextDict: NextCache<TDictionaryRoot, TDictionaryRoot>;
/**
 * @category Dictionary
 */
export declare const rootDict: TDictionaryRoot;
export {};
