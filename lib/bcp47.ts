import { canonicaliseLocales } from "./resolveLocale";
import { searchOrder } from "./searchOrder";

const lc = (str: string): string => str.toLowerCase();

const expCache = new WeakMap<readonly string[], readonly string[]>();

// Cached expansion of locales:
//  ["en-GB", "fr-CA"] -> ["en-GB", "en", "fr-CA", "fr"]
const expand = (langs: readonly string[]): readonly string[] => {
  const tryExp = expCache.get(langs);
  if (tryExp) return tryExp;

  const newExp = searchOrder(langs);
  expCache.set(langs, newExp);
  return newExp;
};

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
  tags: readonly string[],
  langs: readonly string[]
): string | undefined => {
  const ts = new Set(tags.map(lc));
  return expand(canonicaliseLocales(langs)).find(ln => ts.has(lc(ln)));
};
