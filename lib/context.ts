import castArray from "lodash/castArray";
import { TString } from "./string";

import {
  LangContextProps,
  TextPropType,
  TFatString,
  TDictionaryRoot,
  StringPropType
} from "./types";

import { localeRoot, LocaleStack, canonicaliseLocales } from "./localeStack";

/** A language context. Each nested <Translate> gets a new one of these */
export class LangContext {
  readonly defaultLang: string = "en";
  /** @ignore */
  private readonly parent?: LangContext;
  /** @ignore */
  private readonly ambient?: string;
  /** @ignore */
  private readonly dictionary?: TDictionaryRoot;
  /** @ignore */
  private readonly locale: LocaleStack = localeRoot;

  /** @ignore */
  private stackCache: readonly string[] | null = null;
  /** @ignore */
  private tagCache: { [key: string]: TFatString | TDictionaryRoot } = {};

  constructor(props: LangContextProps & { parent?: LangContext } = {}) {
    const { lang, dictionary, ...rest } = props;
    if (dictionary && !("$$dict" in dictionary))
      throw new Error(`Invalid dictionary (missing $$dict key)`);

    // Upgrade lang to array if necessary.
    const langs = castArray(lang).filter(Boolean);

    Object.assign(this, { ...rest, dictionary });

    const ldContext = this.parent
      ? this.parent.locale
      : localeRoot.resolve([this.defaultLang]);

    this.locale = ldContext.resolve(langs);
  }

  /** @ignore */
  private get stack(): readonly string[] {
    return this.locale.stack;
  }

  /**
   * Get the language preference stack for this context. The `languages`
   * array is always normalised - duplicates are removed.
   *
   * ```typescript
   * const ctx = new LangContext({ lang: "cy", defaultLang: "en" });
   * expect(ctx.languages).toEqual(["cy", "en"]);
   *
   * const ctx2 = ctx.derive({ lang: "de", defaultLang: "fr" });
   * expect(ctx2.languages).toEqual(["de", "fr", "cy", "en"]);
   *
   * // "en" de-duplicated from languages
   * const ctx3 = ctx2.derive({ lang: "en" });
   * expect(ctx3.languages).toEqual(["en", "de", "fr", "cy"]);
   *
   * // Start from scratch with an explicit lang stack
   * const ctx4 = new LangContext({ lang: ["en", "de", "fr", "cy"] });
   *
   * // All equivalent stacks are the same object
   * expect(ctx4.languages).toBe(ctx3.languages);
   * ```
   *
   * Equivalent language arrays are always the same object. This makes
   * it possible to use `languages` in e.g. `React.useMemo()` to
   * perform expensive operations only when the language stack changes.
   *
   */
  get languages(): string[] {
    return this.stack as string[];
  }

  get language(): string {
    return this.stack[0];
  }

  get ambience(): string {
    return this.ambient || this.language;
  }

  derive(props: LangContextProps): LangContext {
    // Handle dictionaryFromTag
    const trDFT = ({ dictionaryFromTag, ...rest }: LangContextProps) => {
      if (!dictionaryFromTag) return rest;
      if (props.dictionary)
        throw new Error(`dictionary and dictionaryFromTag both found`);
      return {
        dictionary: this.resolveDictionary(dictionaryFromTag),
        ...rest
      };
    };

    const trDL = ({ defaultLang, ...rest }: LangContextProps) => {
      if (!defaultLang) return rest;
      const { lang, ...other } = rest;
      return {
        defaultLang,
        lang: castArray(lang || []).concat(defaultLang),
        ...other
      };
    };

    const { dictionary, stackCache, tagCache, locale, ...rest } = this;

    return new LangContext({ ...rest, ...trDFT(trDL(props)), parent: this });
  }

  translate(text: TextPropType): TString {
    return this.resolve(text).toLang(this.stack);
  }

  // Convenience method: given a TString (or [tag]) and a props object, translate the
  // string into the current language and update the props' lang attribute as
  // appropriate
  translateTextAndProps(
    text: TextPropType,
    { lang, ...props }: { lang?: string; [key: string]: any } = {},
    count?: number
  ): { str: string; props: {} } {
    const ts = this.translate(text);
    const str = this.render(ts, count);
    if (ts.language !== this.ambience)
      return { str, props: { ...props, lang: ts.language } };
    return { str, props };
  }

  castString(text: StringPropType): TString {
    if (typeof text === "string")
      return TString.literal(text, this.defaultLang);
    return TString.cast(text);
  }

  resolve(text: TextPropType): TString {
    if (Array.isArray(text)) {
      if (text.length !== 1)
        throw new Error(`A tag must be an array of length 1`);
      return this.resolveTag(text[0]);
    }
    return this.castString(text);
  }

  /** @ignore */
  private findTag(tag: string): TFatString | TDictionaryRoot {
    const { tagCache } = this;

    const rt = () => {
      const { parent, dictionary } = this;
      if (dictionary) {
        const { $$dict } = dictionary;
        if ($$dict && tag in $$dict) return $$dict[tag];
      }
      if (parent) return parent.findTag(tag);
      throw new Error(`No translation for ${tag}`);
    };

    return (tagCache[tag] = tagCache[tag] || rt());
  }

  /** @ignore */
  private resolveTag(tag: string): TString {
    const it = this.findTag(tag);
    if ("$$dict" in it) throw new Error(`${tag} is a dictionary`);
    return this.castString(it);
  }

  /** @ignore */
  private resolveDictionary(tag: string): TDictionaryRoot {
    const it = this.findTag(tag);
    if ("$$dict" in it) return it as TDictionaryRoot;
    throw new Error(`${tag} is not a dictionary`);
  }

  resolveTranslationProps(tag?: string, text?: TextPropType): TString {
    const r = () => {
      if (process.env.NODE_ENV !== "production")
        if (tag && text) throw new Error(`Got both tag and text`);
      if (text) return this.resolve(text);
      if (tag) return this.resolveTag(tag);
      throw new Error(`No text or tag`);
    };
    return r().toLang(this.stack);
  }

  resolveLocales(langs: string[]) {
    return this.locale.resolve(langs).stack;
  }

  static canonicaliseLocales(langs: string[]) {
    return canonicaliseLocales(langs).stack;
  }

  resolveMagicProps<T>(props: T, lang?: string): T {
    const mapMagic = (k: string) => {
      const m = k.match(/^t-(.+)$/);
      if (m) return m[1];
    };

    const search = lang ? this.resolveLocales([lang]) : this.locale.stack;

    const pairs = Object.entries(props).map(([k, v]) => {
      const nk = mapMagic(k);
      if (nk) return [nk, this.render(this.resolve(v).toLang(search))];
      return [k, v];
    });

    return Object.fromEntries(pairs);
  }

  render(ts: TString, count?: number): string {
    const stack = this.resolveLocales([ts.language]);
    return ts
      .toString(count)
      .split(/(%%|%\{[^%]+?\})/)
      .map(tok =>
        (match =>
          match
            ? this.resolveTag(match[1]).toLang(stack).toString(count)
            : tok)(tok.match(/^%\{(.+)\}$/))
      )
      .join("");
  }
}
