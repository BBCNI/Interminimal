import { LocaleStack, TFatString } from "./types";

import difference from "lodash/difference";
import { bestLocale, canonicaliseLanguage } from "./bcp47";

const diffs = (a: string[], b: string[]) => [
  difference(a, b),
  difference(b, a)
];

const isNonCanonical = (lang: string) => {
  if (lang === "*") return false;
  const canon = canonicaliseLanguage(lang);
  return canon !== lang;
};

/**
 * Wrap a fat string with methods to coerce it to a specific
 * language and stringify it. TStrings are immutable; all
 * methods that appear to modify a TString return a new one.
 *
 * ```typescript
 * import { TString } from "interminimal";
 *
 * const catsDict = {
 *   en: { one: "cat", other: "cats" },
 *   de: { one: "Katze", other: "Katzen" },
 *   cy: {
 *     zero: "cathod",
 *     one: "gath",
 *     two: "gath",
 *     few: "cath",
 *     many: "chath",
 *     other: "cath"
 *   }
 * };
 *
 * const counts = [0, 1, 1.5, 2, 3, 6, 42];
 *
 * // Count the cats in Welsh
 * const cat = TString.cast(catsDict);
 * const welshCat = cat.toLang(["cy", "en"]);
 * for (const count of counts) {
 *   console.log(`${count} ${welshCat.toString(count)}`);
 * }
 * // 0 cathod
 * // 1 gath
 * // 1.5 cath
 * // 2 gath
 * // 3 cath
 * // 6 chath
 * // 42 cath
 * ```
 * @category Classes
 */
export class TString {
  /** @ignore */
  private readonly dict: TFatString;
  /** @ignore */
  private readonly lang: string | undefined;

  /** @ignore */
  private constructor(dict: TFatString, lang?: string) {
    this.dict = dict;
    this.lang = lang;
  }

  /**
   * Cast a TString or TFatString to a TString. This is the main way of
   * creating new TStrings.
   *
   * @param obj either a fat string or an existing TString
   * @param lang an optional language
   * @returns a TString which may be `obj` if `obj` is already a TString
   */
  static cast(obj: TFatString | TString, lang?: string): TString {
    if (obj instanceof TString) {
      if (lang) return obj.toLang([lang]);
      return obj;
    }

    if (process.env.NODE_ENV !== "production") {
      const bad = Object.keys(obj).filter(isNonCanonical);
      if (bad.length)
        throw new Error(
          `Non-canonical BCP 47 language tags: ${bad.join(", ")}`
        );
    }

    const ts = new this(obj);
    if (lang) return ts.toLang([lang]);
    return ts;
  }

  /**
   * Cast a string literal and language into a single-language TString.
   *
   * ```typescript
   * const ts = TString.literal("Hello", "en");
   * // Try to convert to "de", won't work - we'll get "en" instead
   * console.log(ts.toLang["de"].language); // "en"
   * ```
   *
   * @param str a regular string
   * @param lang the language of the string
   * @returns a new TString
   */
  static literal(str: string, lang: string): TString {
    return this.cast({ [lang]: str }, lang);
  }

  /**
   * Get the current language of this TString. Throws an error if this
   * is a floating TString with no language selected.
   */
  get language(): string {
    const { lang } = this;
    if (!lang) throw new Error(`This TString must have a language`);
    return lang;
  }

  /**
   * Get the dictionary of this TString.
   */
  get dictionary(): TFatString {
    return this.dict;
  }

  /**
   * Render this TString as a string. When the TString contains plural
   * forms an appropriate plural will be chosen based on `count`. The
   * correct plural form is chosen using `Intl.PluralRules`.
   *
   * ```typescript
   * // Plurals
   * const ts = new TString({
   *   en: { one: "cat", other: "cats" },
   *   de: { one: "Katze", other: "Katzen" }
   * });
   * console.log(ts.toLang(["de"]).toString(10)); // "Katzen"
   * ```
   *
   * @param count an optional count to select a plural form
   */
  toString(count?: number): string {
    const { language } = this;
    const ttx = this.dict[language];
    if (typeof ttx === "string") return ttx;

    const pl = new Intl.PluralRules(language);

    if (process.env.NODE_ENV !== "production") {
      // Check that our fat string has all the required
      // plural categories.
      const { pluralCategories } = pl.resolvedOptions();
      const [missing, extra] = diffs(pluralCategories, Object.keys(ttx));
      if (missing.length)
        throw new Error(`Missing plural categories: ${missing.join(", ")}`);
      if (extra.length)
        throw new Error(`Unknown plural categories: ${extra.join(", ")}`);
    }

    const plur = pl.select(count ?? 1);

    // istanbul ignore next - we can only have a missing plural in prod.
    return ttx[plur] || "";
  }

  /**
   * Attempt to translate this TString into one of a list of languages.
   *
   * ```typescript
   * const ts = new TString({
   *   en: "color",
   *   de: "Farbe"
   * });
   * // We'd like British English or French but we'll get "en"
   * // (U.S. English) which is the best match for "en-GB"
   * console.log(ts.toLang(["en-GB", "fr"]), toString()); // "color"
   * ```
   *
   * @param langs an array of BCP47 language codes in descending preference order
   * @returns a new TString with its `language` set to the best match
   */
  toLang(langs: LocaleStack): TString {
    const { lang, dict } = this;

    const first = langs[0];
    // fast cases
    if (first === lang) return this;
    if (first in dict) return new TString(dict, first);

    const tags = Object.keys(dict);
    if (tags.length > 1) {
      const best = bestLocale(tags, langs);
      if (best) return best === lang ? this : new TString(dict, best);
    }

    // If there's a wildcard pretend that's what we were looking for.
    if ("*" in dict) return new TString({ ...dict, [first]: dict["*"] }, first);

    // If we already have a language assume that's good enough.
    if (lang) return this;

    // Do we have _any_ languages?
    if (tags.length) return new TString(dict, tags[0]);

    // Nope.
    throw new Error(`No translations available`);
  }
}
