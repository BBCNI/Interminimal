import { searchOrder } from "./searchOrder";
import { canonicaliseLocales } from "./resolveLocale";
import { LocaleStack } from "./types";

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
export const bestLocale = (
  tags: LocaleStack,
  langs: LocaleStack
): string | undefined => {
  const ts = new Set(tags);
  return searchOrder(canonicaliseLocales(langs)).find(ln => ts.has(ln));
};

const canonCache = new Map<string, string | undefined>();

/**
 * Canonicalise a language tag. No caching - safe to use on user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export const safeCanonicaliseLanguage = (tag: string): string | undefined => {
  try {
    // Or use Intl.getCanonicalLocales()? Doesn't make much different - the
    // same error can be thrown.
    return new Intl.Locale(tag).toString();
  } catch (e) {}
};

/**
 * Canonicalise a language tag. Canonicalisation is cached so don't
 * call this function on untrusted input. Use
 * [[`safeCanonicaliseLanguage`]] for user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export const canonicaliseLanguage = (tag: string): string | undefined => {
  if (canonCache.has(tag)) return canonCache.get(tag);
  const canon = safeCanonicaliseLanguage(tag);
  canonCache.set(tag, canon);
  return canon;
};
