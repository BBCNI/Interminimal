import uniq from "lodash/uniq";
import castArray from "lodash/castArray";
import { TString } from "./string";

import {
  MagicPropsPredicate,
  LangContextProps,
  TextPropType,
  TFatString,
  TDictionaryRoot
} from "./types";

const defaultMagicProps: MagicPropsPredicate = (k: string) => {
  const m = k.match(/^t-(.+)$/);
  if (m) return m[1];
};

export class LangContext {
  readonly parent?: LangContext;
  readonly strict: boolean = true;
  readonly defaultLang: string = "en";
  readonly magicProps: MagicPropsPredicate = defaultMagicProps;
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

  get language() {
    return this.stack[0];
  }

  get ambience() {
    return this.ambient || this.language;
  }

  derive(props: LangContextProps = {}) {
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

  resolveText(text: TextPropType) {
    if (Array.isArray(text)) {
      if (text.length !== 1)
        throw new Error(`To be a valid tag a text property must be [tag]`);
      return this.resolveTag(text[0]);
    }
    if (typeof text === "string")
      return TString.literal(text, this.defaultLang);
    return TString.cast(text);
  }

  findTag(tag: string): TFatString | TDictionaryRoot {
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

  resolveTag(tag: string): TString {
    const it = this.findTag(tag);
    if ("$$dict" in it) throw new Error(`${tag} is a dictionary`);
    return TString.cast(it);
  }

  resolveDictionary(tag: string): TDictionaryRoot {
    const it = this.findTag(tag);
    if ("$$dict" in it) return it as TDictionaryRoot;
    throw new Error(`${tag} is not a dictionary`);
  }

  resolve(tag?: string, text?: TextPropType) {
    const r = () => {
      if (tag && text) throw new Error(`Got both tag and text`);
      if (text) return this.resolveText(text);
      if (tag) return this.resolveTag(tag);
      throw new Error(`No text or tag`);
    };
    return r().toLang(this.stack);
  }

  resolveProps(props: { [key: string]: any }, lang?: string) {
    const { magicProps, stack } = this;
    if (!magicProps) return props;
    const search = lang ? [lang, ...stack] : stack;

    const pairs = Object.entries(props).map(([k, v]) => {
      const nk = magicProps(k, v);
      if (nk) return [nk, this.render(this.resolveText(v).toLang(search))];
      return [k, v];
    });

    return Object.fromEntries(pairs);
  }

  render(ts: TString, count?: number) {
    const str = ts.toString(count);
    const parts = str.split(/(?<!%)%\{(.+?)\}/);
    if (parts.length === 1) return parts[0];
    const out = [];

    while (parts.length) {
      const [frag, tag] = parts.splice(0, 2);
      if (frag.length) out.push(frag);
      // TODO detect language mixing here.
      if (tag)
        out.push(this.resolveTag(tag).toLang(this.stack).toString(count));
    }

    return out.join("");
  }
}
