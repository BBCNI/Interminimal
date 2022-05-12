import { TFatString } from "./types";

import difference from "lodash/difference";

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
    if (obj instanceof this) {
      if (lang) return obj.toLang([lang]);
      return obj;
    }
    return new this(obj as TFatString, lang);
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

  toLang(langs: string | readonly string[]): TString {
    if (!Array.isArray(langs)) return this.toLang([langs] as readonly string[]);
    const { lang, dict } = this;
    for (const l of langs) {
      if (!l) continue;
      if (l === lang) return this;
      if (l in dict) return new TString(dict, l);
    }

    // Wildcard language matches anything. Used for e.g. proper nouns that
    // are the same in any language.
    if ("*" in dict) {
      const ts = { ...dict };
      ts[langs[0]] = dict["*"];
      return new TString(ts, langs[0]);
    }

    if (lang) return this;

    const fallback = Object.keys(dict)[0];
    if (!fallback) throw new Error(`No translations available`);
    return new TString(dict, fallback);
  }
}
