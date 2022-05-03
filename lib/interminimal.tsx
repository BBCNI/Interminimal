import {
  ComponentClass,
  ComponentType,
  createContext,
  createElement,
  FunctionComponent,
  ReactNode,
  useContext
} from "react";

type LangType = string | undefined;

export interface TDictType {
  readonly [key: string]: string;
}

export interface TTranslationType {
  readonly [key: string]: TDictType;
}

interface ContextProps {
  readonly defaultLang: string;
  readonly lang?: string;
  readonly ambient?: string;
  readonly translation?: TTranslationType;
}

type AsType =
  | string
  | FunctionComponent<{ lang?: string | undefined }>
  | ComponentClass<{ lang?: string | undefined }, any>;

const TContext = createContext<ContextProps>({ defaultLang: "en" });

export class TString {
  readonly dict: TDictType;
  readonly lang: LangType;

  constructor(dict: TDictType, lang?: LangType) {
    if (lang && !(lang in dict)) throw new Error(`${lang} not in dictionary`);
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: TDictType | TString, lang?: LangType) {
    if (obj instanceof this) return obj;
    return new this(obj as TDictType, lang);
  }

  static literal(str: string, lang: string) {
    return new this({ [lang]: str }, lang);
  }

  toString() {
    if (!this.lang) throw new Error(`Can't render with undefined lang`);
    return this.dict[this.lang];
  }

  toLang(langs: LangType | LangType[]): TString {
    if (!Array.isArray(langs)) return this.toLang([langs]);
    for (const lang of langs) {
      if (!lang) continue;
      if (lang === this.lang) return this;
      if (lang in this.dict) return new TString(this.dict, lang);
    }
    if (this.lang) return this;
    const fallback = Object.keys(this.dict)[0];
    if (!fallback) throw new Error(`No translations available in any language`);
    return new TString(this.dict, fallback);
  }
}

export const useTranslation = () => useContext<ContextProps>(TContext);

// Set the ambient language
export const Ambience: ComponentType<{
  children: ReactNode;
  ambient?: string;
}> = ({ children, ...props }) => {
  const up = useTranslation();
  const ctx = { ...up, ...props };
  return <TContext.Provider value={ctx}>{children}</TContext.Provider>;
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
  const curLang = ctx.ambient || ctx.lang;

  if (lang !== curLang)
    return (
      <Ambience ambient={lang}>
        <As as={as} {...props} lang={lang}>
          {children}
        </As>
      </Ambience>
    );
  return (
    <As as={as} {...props}>
      {children}
    </As>
  );
};

export const Translate: ComponentType<{
  children: ReactNode;
  lang?: string;
  ambient?: string;
  translation?: TTranslationType;
  as?: AsType;
}> = ({ children, as = "div", ...props }) => {
  const up = useTranslation();
  const ctx = { ...up, ...props };
  return (
    <TText as={as} lang={ctx.lang || ctx.defaultLang}>
      <TContext.Provider value={ctx}>{children}</TContext.Provider>
    </TText>
  );
};

type TextPropType = TDictType | TString | string;

const lookupTag = (ctx: ContextProps, tag?: string, text?: TextPropType) => {
  if (text) {
    if (typeof text === "string")
      return TString.literal(text, ctx.lang || ctx.defaultLang);
    return TString.cast(text);
  }

  if (tag) {
    if (!ctx.translation) throw new Error(`Context has no translation table`);
    const dict = ctx.translation[tag];
    if (!dict) throw new Error(`No translation for ${tag}`);
    return TString.cast(dict);
  }

  throw new Error(`No text or tag`);
};

type ChildType = ReactNode | TDictType | TString;

export const TFormat: ComponentType<{
  format: string;
  params: ChildType[];
}> = ({ format, params }) => {
  const parts = format.split(/%(\d)/);

  const avail = new Set(params.map((_x: any, i: number) => i + 1));
  const out = [];
  while (parts.length) {
    const [frag, arg] = parts.splice(0, 2);
    if (frag.length) out.push(frag);
    if (arg) {
      const idx = Number(arg);
      if (idx < 1 || idx > params.length)
        throw new Error(
          `Arg out of range %${idx} (1..${params.length} are valid)`
        );
      if (!avail.has(idx)) throw new Error(`Already using arg %${idx}`);
      avail.delete(idx);
      out.push(params[idx - 1]);
    }
  }

  if (avail.size) throw new Error(`Unused args: ${avail}`);
  return <>{out}</>;
};

interface TProps {
  children?: ChildType[];
  tag?: string;
  text?: TextPropType;
  as?: AsType;
  [key: string]: any;
}

export const T: ComponentType<TProps> = ({
  children,
  tag,
  text,
  as = "span",
  ...props
}) => {
  const ctx = useTranslation();

  if (!tag && !text) throw new Error(`Missing tag / text`);
  if (tag && text) throw new Error(`Got both tag and text`);

  const ts = lookupTag(ctx, tag, text).toLang([ctx.lang, ctx.defaultLang]);
  const lang = ts.lang || ctx.defaultLang;

  if (children)
    return (
      <TText as={as} lang={lang} {...props}>
        <TFormat format={ts.toString()} params={children} />
      </TText>
    );

  return (
    <TText as={as} lang={lang} {...props}>
      {ts.toString()}
    </TText>
  );
};
