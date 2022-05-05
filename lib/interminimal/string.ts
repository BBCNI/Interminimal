import { TFatString } from ".";

export class TString {
  readonly dict: TFatString;
  readonly lang?: string;

  constructor(dict: TFatString, lang?: string) {
    if (lang && !(lang in dict)) throw new Error(`${lang} not in dictionary`);
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: TFatString | TString, lang?: string) {
    if (obj instanceof this) return obj;
    return new this(obj as TFatString, lang);
  }

  static literal(str: string, lang: string) {
    return new this({ [lang]: str }, lang);
  }

  toString(count?: number): string {
    if (!this.lang) throw new Error(`Can't translate with undefined lang`);
    const ttx = this.dict[this.lang];

    // Plurals?
    if (typeof ttx === "object") {
      const plur = new Intl.PluralRules(this.lang).select(count ?? 1);
      if (!(plur in ttx))
        throw new Error(`Can't map plural ${plur} for ${count ?? 1}`);
      return ttx[plur] as string;
    }

    return ttx;
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
