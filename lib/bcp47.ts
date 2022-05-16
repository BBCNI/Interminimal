import { canonicaliseLocales } from "./localeStack";

const lc = (str: string): string => str.toLowerCase();

const cache = new WeakMap<readonly string[], readonly string[]>();

const expandLang = (lang: string): readonly string[] => {
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return [lang];
  // foo-x-bar?
  if (idx > 2 && lang.charAt(idx - 2) === "-")
    return [lang].concat(expandLang(lang.slice(0, idx - 2)));
  // foo-BAR
  return [lang].concat(expandLang(lang.slice(0, idx)));
};

const expand = (langs: readonly string[]): readonly string[] => {
  const exp = cache.get(langs);
  if (exp) return exp;

  const nexp = canonicaliseLocales(langs.flatMap(expandLang)).stack;
  cache.set(langs, nexp);
  return nexp;
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
 * @param tags an array of available language tags
 * @param langs an array of locales to match
 * @returns a language tag or `undefined` if no match found
 */
export const bestLocale = (
  tags: readonly string[],
  langs: readonly string[]
): string | undefined => {
  const ts = new Set(tags.map(lc));
  return expand(langs).find(ln => ts.has(lc(ln)));
};
