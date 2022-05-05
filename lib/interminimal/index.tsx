import {
  ComponentType,
  createContext,
  createElement,
  ReactNode,
  Children,
  useContext,
  Fragment,
  cloneElement,
  isValidElement
} from "react";

import { parseTemplate } from "./template";

import uniq from "lodash/uniq";
import castArray from "lodash/castArray";

import {
  MagicPropsPredicate,
  TDictionaryType,
  LangContextProps,
  TextPropType,
  TFatString,
  AsType,
  TProps
} from "./types";

const defaultMagicProps: MagicPropsPredicate = (k: string) => {
  const m = k.match(/^t-(.+)$/);
  if (m) return m[1];
};

class LangContext {
  readonly parent?: LangContext;
  readonly strict: boolean = true;
  readonly defaultLang: string = "en";
  readonly magicProps: MagicPropsPredicate = defaultMagicProps;
  readonly lang: string[] = [];
  readonly ambient?: string;
  readonly dictionary?: TDictionaryType;

  private stackCache: readonly string[] | null = null;
  private tagCache: { [key: string]: TString } = {};

  constructor(props: LangContextProps = {}) {
    const { lang, ...rest } = props;
    // Upgrade lang to array if necessary.
    const langs = castArray(lang).filter(Boolean);
    Object.assign(this, { lang: langs, ...rest });
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
    const { dictionary, stackCache, tagCache, lang, ...rest } = this;
    return new LangContext({ ...rest, ...props, parent: this });
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

  resolveTag(tag: string): TString {
    const { tagCache } = this;
    const rt = () => {
      const { parent, dictionary } = this;
      if (dictionary && tag in dictionary) return TString.cast(dictionary[tag]);
      if (parent) return parent.resolveTag(tag);
      throw new Error(`No translation for ${tag}`);
    };
    return (tagCache[tag] = tagCache[tag] || rt());
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

const TContext = createContext(new LangContext());

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
      return ttx[plur];
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

export const useTranslation = () => useContext(TContext);

// Set the ambient language
export const Local: ComponentType<
  LangContextProps & { children: ReactNode }
> = ({ children, ...props }) => {
  const ctx = useTranslation().derive(props);
  return <TContext.Provider value={ctx}>{children}</TContext.Provider>;
};

export const Translate: ComponentType<
  LangContextProps & { children: ReactNode; as?: AsType }
> = ({ children, as = "div", ...props }) => {
  const ctx = useTranslation().derive(props);
  return (
    <TText as={as} lang={ctx.language}>
      <TContext.Provider value={ctx}>{children}</TContext.Provider>
    </TText>
  );
};

// Create a component with the specified tag
const As: ComponentType<{
  as: AsType;
  children?: ReactNode;
  [key: string]: any;
}> = ({ as, children, ...props }) => createElement(as, props, children);

export const TText: ComponentType<{
  children: ReactNode;
  lang: string;
  as: AsType;
  [key: string]: any;
}> = ({ children, lang, as, ...props }) => {
  const ctx = useTranslation();

  if (lang !== ctx.ambience)
    return (
      <Local ambient={lang}>
        <As as={as} {...props} lang={lang}>
          {children}
        </As>
      </Local>
    );
  return (
    <As as={as} {...props}>
      {children}
    </As>
  );
};

const clone = (elt: any) => (isValidElement(elt) ? cloneElement(elt) : elt);

export const TFormat: ComponentType<{
  format: string;
  lang: string;
  children?: ReactNode;
}> = ({ format, lang, children }) => {
  const ctx = useTranslation();

  const parts = parseTemplate(format);

  console.log({ format, lang, parts });

  // Parse format string
  // const parts = format.split(/%(%|\d+)/);
  if (parts.length === 1 && typeof parts[0] === "string")
    return <Fragment>{parts[0]}</Fragment>;

  // Make children into a regular array of nodes
  const params = Children.map<ReactNode, any>(children, x => x) || [];

  // Set of available indexes
  const avail = new Set(params.map((_x: any, i: number) => i + 1));

  const dict: TDictionaryType = {};

  // Output nodes
  const out = parts.map(part => {
    if (typeof part === "string") return part;
    const { index, name, text } = part;

    if (name && text) dict[name] = TString.literal(text, lang).dict;

    if (index < 1 || index > params.length)
      throw new Error(
        `Arg out of range %${index} (1..${params.length} are valid)`
      );

    if (ctx.strict && !avail.has(index))
      throw new Error(`Already using arg %${index}`);

    avail.delete(index);
    return clone(params[index - 1]);
  });

  if (ctx.strict && avail.size) throw new Error(`Unused args: ${avail}`);
  console.log(dict);

  if (Object.keys(dict).length) return <Local dictionary={dict}>{out}</Local>;

  return <Fragment>{out}</Fragment>;
};

export const T: ComponentType<TProps> = ({
  children,
  tag,
  text,
  count,
  as = "span",
  ...props
}) => {
  const ctx = useTranslation();
  if (tag || text) {
    const ts = ctx.resolve(tag, text);
    if (!ts.lang) throw new Error(`No lang on translation`);

    console.log(ts);

    return (
      <TText as={as} lang={ts.lang} {...ctx.resolveProps(props, ts.lang)}>
        <TFormat lang={ts.lang} format={ctx.render(ts, count)}>
          {children}
        </TFormat>
      </TText>
    );
  }

  return (
    <TText as={as} {...ctx.resolveProps(props)}>
      {children}
    </TText>
  );
};

const boundMap = new Map();

export const tBind = (as: AsType): ComponentType<TProps> => {
  const bind = (as: AsType): ComponentType<TProps> => {
    const bound: ComponentType<TProps> = ({ children, ...props }) => (
      <T as={as} {...props}>
        {children}
      </T>
    );
    const asName =
      typeof as === "string" ? as : as.displayName ?? as.name ?? "anon";
    for (const prop of ["name", "displayName"])
      Object.defineProperty(bound, prop, { value: `T${asName}` });
    return bound;
  };

  let bound = boundMap.get(as);
  if (!bound) boundMap.set(as, (bound = bind(as)));
  return bound;
};

export const tBindMulti = (as: AsType[]) => as.map(tBind);
