import { TFatString } from "./types";

import difference from "lodash/difference";
import { bestLocale } from "./bcp47";

const diffs = (a: string[], b: string[]) => [
  difference(a, b),
  difference(b, a)
];

export class TString {
  private readonly dict: TFatString;
  private readonly lang: string | undefined;

  constructor(dict: TFatString, lang?: string) {
    if (lang && !(lang in dict)) throw new Error(`${lang} not in dictionary`);
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: TFatString | TString, lang?: string): TString {
    if (obj instanceof TString) {
      if (lang) return obj.toLang([lang]);
      return obj;
    }
    return new this(obj, lang);
  }

  static literal(str: string, lang: string): TString {
    return new this({ [lang]: str }, lang);
  }

  get language(): string {
    const { lang } = this;
    if (!lang) throw new Error(`This TString must have a language`);
    return lang;
  }

  get dictionary(): TFatString {
    return this.dict;
  }

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

  toLang(langs: readonly string[]): TString {
    const { lang, dict } = this;

    const first = langs[0];
    // fast cases
    if (first === lang) return this;
    if (first in dict) return new TString(dict, first);

    const tags = Object.keys(dict);
    if (tags.length > 1) {
      const best = bestLocale(tags, [...langs]);
      if (best) return best === lang ? this : new TString(dict, best);
    }

    if ("*" in dict) return new TString({ ...dict, [first]: dict["*"] }, first);

    if (lang) return new TString(dict, lang);
    if (tags.length) return new TString(dict, tags[0]);
    throw new Error(`No translations available`);
  }
}
