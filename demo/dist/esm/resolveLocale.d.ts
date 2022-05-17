import "./weakRef";
declare type StackArray = readonly string[];
export declare const resolveLocales: (stack: StackArray, langs: StackArray) => StackArray;
export declare const localeRoot: StackArray;
export declare const canonicaliseLocales: (stack: StackArray) => StackArray;
export {};
