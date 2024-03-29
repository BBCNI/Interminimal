import { LocaleStack } from "./resolveLocale";
/**
 * Given a set of BCP 47 language tags and a list of locales in
 * descending preference order find the tag that best satisfies
 * the locale preference.
 *
 * ```typescript
 * import { bestLocale } from "interminimal";
 * const tags = ["en", "en-GB", "fr", "fr-BE"];
 * console.log(bestLocale(tags, ["en-GB"])); // en-GB
 * console.log(bestLocale(tags, ["en-AU", "fr-BE"])); // en
 * console.log(bestLocale(tags, ["de", "fr-BE", "en"])); // fr-BE
 * console.log(bestLocale(tags, ["cy", "fr-BE-x-foo", "en"])); // fr-BE
 * console.log(bestLocale(tags, ["de", "de-AT"])); // undefined
 * ```
 *
 * @param tags an array of available language tags - order unimportant
 * @param langs an array of locales to match
 * @returns a language tag or `undefined` if no match found
 * @category Locale
 */
export declare const bestLocale: (tags: LocaleStack, langs: LocaleStack) => string | undefined;
/**
 * Canonicalise a language tag. No caching - safe to use on user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export declare const safeCanonicaliseLanguage: (tag: string) => string | undefined;
/**
 * Canonicalise a language tag. Canonicalisation is cached so don't
 * call this function on untrusted input. Use
 * [[`safeCanonicaliseLanguage`]] for user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export declare const canonicaliseLanguage: (tag: string) => string | undefined;
