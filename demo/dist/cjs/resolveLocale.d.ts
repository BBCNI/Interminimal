import "./weakRef";
import { LocaleStack } from "./types";
export declare const resolveLocales: (stack: LocaleStack, langs: LocaleStack) => LocaleStack;
export declare const localeRoot: LocaleStack;
export declare const canonicaliseLocales: (stack: LocaleStack) => LocaleStack;
