import uniq from "lodash/uniq";
import castArray from "lodash/castArray";
import { TString } from "./string";

import {
  LangContextProps,
  TextPropType,
  TFatString,
  TDictionaryRoot,
  StringPropType
} from "./types";

export class LangContext {
  readonly parent?: LangContext;
  readonly defaultLang: string = "en";
  readonly lang: string[] = [];
  readonly ambient?: string;
  readonly dictionary?: TDictionaryRoot;

  private stackCache: readonly string[] | null = null;
  private tagCache: { [key: string]: TFatString | TDictionaryRoot } = {};

  constructor(props: LangContextProps = {}) {
    const { lang, dictionary, ...rest } = props;
    if (dictionary && !("$$dict" in dictionary))
      throw new Error(`Invalid dictionary (missing $$dict key)`);
    // Upgrade lang to array if necessary.
    const langs = castArray(lang).filter(Boolean);
    Object.assign(this, { lang: langs, dictionary, ...rest });
  }

  get stack(): readonly string[] {
    const seal = (o: string[]) => Object.freeze(uniq(o));
    const s = () => {
      const { parent, lang, defaultLang } = this;

      if (parent) {
        // Optimisation: if we don't add any languages our stack
        // is the same as our parent's.
        if (lang.length === 0) return parent.stack;
        return seal(lang.concat(parent.stack));
      }

      return seal(lang.concat(defaultLang));
    };

    return (this.stackCache = this.stackCache || s());
  }

  get language(): string {
    return this.stack[0];
  }

  get ambience(): string {
    return this.ambient || this.language;
  }

  derive(props: LangContextProps = {}): LangContext {
    // Handle dictionaryFromTag
    const transformProps = ({
      dictionaryFromTag,
      ...rest
    }: LangContextProps) => {
      if (dictionaryFromTag) {
        if (props.dictionary)
          throw new Error(`dictionary and dictionaryFromTag both found`);
        return {
          dictionary: this.resolveDictionary(dictionaryFromTag),
          ...rest
        };
      }
      return rest;
    };

    const { dictionary, stackCache, tagCache, lang, ...rest } = this;
    return new LangContext({ ...rest, ...transformProps(props), parent: this });
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

  private resolveTag(tag: string): TString {
    const it = this.findTag(tag);
    if ("$$dict" in it) throw new Error(`${tag} is a dictionary`);
    return this.castString(it);
  }

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

  resolveMagicProps<T>(props: T, lang?: string): T {
    const { stack } = this;

    const mapMagic = (k: string) => {
      const m = k.match(/^t-(.+)$/);
      if (m) return m[1];
    };

    const search = lang ? [lang, ...stack] : stack;

    const pairs = Object.entries(props).map(([k, v]) => {
      const nk = mapMagic(k);
      if (nk) return [nk, this.render(this.resolve(v).toLang(search))];
      return [k, v];
    });

    return Object.fromEntries(pairs);
  }

  render(ts: TString, count?: number): string {
    return ts
      .toString(count)
      .split(/(%%|%\{[^%]+?\})/)
      .map(tok =>
        (match =>
          match
            ? this.resolveTag(match[1])
                .toLang([ts.language, ...this.stack])
                .toString(count)
            : tok)(tok.match(/^%\{(.+)\}$/))
      )
      .join("");
  }
}
