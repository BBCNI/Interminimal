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
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: TDictType | TString, lang?: LangType) {
    if (obj instanceof this) return obj;
    return new this(obj as TDictType, lang);
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
    // if ("*" in this.dict) return new TString(this.dict, langs[0]);
    if (this.lang) return this;
    const fallback = Object.keys(this.dict)[0];
    if (!fallback) throw new Error(`No translations available in any language`);
    return new TString(this.dict, fallback);
  }
}

export const useTranslation = () => useContext<ContextProps>(TContext);

const TText: ComponentType<{
  children: ReactNode;
  lang: string;
  as: AsType;
  [key: string]: any;
}> = ({ children, lang, as, ...props }) => {
  const ctx = useTranslation();
  return lang !== ctx.lang
    ? createElement(as, { ...props, lang }, children)
    : createElement(as, props, children);
};

export const Translate: ComponentType<{
  children: ReactNode;
  lang?: string;
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

interface TProps {
  children?: ReactNode | TDictType | TString;
  tag?: string;
  as?: AsType;
  [key: string]: any;
}

export const T: ComponentType<TProps> = ({
  children,
  tag,
  as = "span",
  ...props
}) => {
  const ctx = useTranslation();

  const renderString = (tstr: TString) => {
    const ts = tstr.toLang([ctx.lang, ctx.defaultLang]);
    return (
      <TText as={as} lang={ts.lang || ctx.defaultLang} {...props}>
        {ts.toString()}
      </TText>
    );
  };

  if (children) {
    if (tag) throw new Error(`Please provide tag or children, not both`);

    if (typeof children === "object")
      return renderString(TString.cast(children));

    return (
      <TText as={as} lang={ctx.defaultLang} {...props}>
        {children}
      </TText>
    );
  }

  // Tagged translation?
  if (!tag) throw new Error(`Missing tag or children`);
  if (!ctx.translation) throw new Error(`Context has no translation table`);
  const dict = ctx.translation[tag];
  if (!dict) throw new Error(`No translation for ${tag}`);

  return renderString(new TString(dict));
};
