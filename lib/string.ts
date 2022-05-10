import { TFatString } from "./types";

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
    const ttx = this.dict[this.language];
    if (typeof ttx === "string") return ttx;

    const plur = new Intl.PluralRules(this.lang).select(count ?? 1);
    const result = ttx[plur];
    if (typeof result === "string") return result;

    throw new Error(`Can't map plural ${plur} for ${count ?? 1}`);
  }

  toLang(langs: string | readonly string[]): TString {
    if (!Array.isArray(langs)) return this.toLang([langs] as readonly string[]);
    for (const lang of langs) {
      if (!lang) continue;
      if (lang === this.lang) return this;
      if (lang in this.dict) return new TString(this.dict, lang);
    }
    if (this.lang) return this;
    const fallback = Object.keys(this.dict)[0];
    if (!fallback) throw new Error(`No translations available`);
    return new TString(this.dict, fallback);
  }
}
