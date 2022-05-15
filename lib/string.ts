import { TFatString } from "./types";

import difference from "lodash/difference";
import { shapeSlot } from "./shapeMap";
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

  private get slot(): WeakMap<any, any> {
    return shapeSlot(this.dict);
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
    if (first === lang) return this;
    if (first in dict) return new TString(dict, first);

    const resolveKey = () => {
      const tags = Object.keys(dict);
      const best = bestLocale(tags, [...langs]);
      if (best) return best;
      if ("*" in dict) return "*";
      if (lang) return lang;
      return tags[0];
    };

    const lookupKey = () => {
      const { slot } = this;
      let key = slot.get(langs);
      if (!key) slot.set(langs, (key = resolveKey()));
      return key;
    };

    const key = lookupKey();

    if (!key) throw new Error(`No translations available`);

    if (key === "*")
      return new TString({ ...dict, [langs[0]]: dict["*"] }, langs[0]);

    if (key === lang) return this;
    return new TString(dict, key);
  }
}
