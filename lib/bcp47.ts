const lc = (str: string): string => str.toLowerCase();

const lookup = (tags: Set<string>, lang: string): string | undefined => {
  if (tags.has(lc(lang))) return lang;
  // any extensions?
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return;
  // foo-x-bar?
  if (idx > 2 && lang.charAt(idx - 2) === "-")
    return lookup(tags, lang.slice(0, idx - 2));
  // foo-BAR
  return lookup(tags, lang.slice(0, idx));
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
  tags: string[],
  langs: string[]
): string | undefined => {
  const ts = new Set(tags.map(lc));
  for (const lang of langs) {
    const m = lookup(ts, lang);
    if (m) return m;
  }
};
