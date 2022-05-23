import { LocaleStack } from "./resolveLocale";
export declare const maxAcceptLanguageLength = 200;
/**
 * Parse an HTTP Accept-Language header. Badly formed languages are
 * dropped, languages are canonicalised.
 *
 * ```typescript
 * const stack = parseAcceptLanguage("fr;b=9,en-GB;q=0.9,en-AU;q=0.8");
 * console.log(stack); // [ "en-GB", "en-AU" ]
 * ```
 *
 * @param accept the contents of the header
 * @returns a priority ordered language stack
 * @category Locale
 */
export declare const parseAcceptLanguage: (accept: string) => LocaleStack;
