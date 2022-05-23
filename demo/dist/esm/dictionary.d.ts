import { TFatString } from "./string";
import { NextCache } from "./nextCache";
declare type TDictionaryType = {
    [key: string]: TFatString | TDictionaryRoot;
} & {
    $$dict?: never;
};
export declare type TDictionaryMeta = {
    [key: string]: string;
};
/**
 * The root of a translation dictionary
 */
export declare type TDictionaryRoot = {
    /** the translations */
    $$dict: TDictionaryType;
    /** optional metadata - ignored by _Interminimal_ */
    $$meta?: TDictionaryMeta;
};
export declare const checkDictionary: (dictionary: TDictionaryRoot) => void;
export declare const nextDict: NextCache<TDictionaryRoot, TDictionaryRoot>;
export declare const rootDict: TDictionaryRoot;
export {};
