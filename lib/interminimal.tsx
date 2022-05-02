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

interface DictType {
  readonly [key: string]: string;
}

interface TranslationType {
  readonly [key: string]: DictType;
}

interface ContextProps {
  readonly defaultLang: string;
  readonly lang?: string;
  readonly translation?: TranslationType;
}

type AsType =
  | string
  | FunctionComponent<{ lang?: string | undefined }>
  | ComponentClass<{ lang?: string | undefined }, any>;

const TContext = createContext<ContextProps>({ defaultLang: "en" });

export class TString {
  readonly dict: DictType;
  readonly lang: LangType;

  constructor(dict: DictType, lang?: LangType) {
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: any, lang?: LangType) {
    if (obj instanceof this) return obj;
    return new this(obj as DictType, lang);
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
    if (this.lang !== null) return this;
    return new TString(this.dict, Object.keys(this.dict)[0]);
  }
}

export const useTranslation = () => useContext<ContextProps>(TContext);

const LangText: ComponentType<{
  children: ReactNode;
  lang: string;
  as: AsType;
}> = ({ children, lang, as }) => {
  const ctx = useTranslation();
  return lang !== ctx.lang
    ? createElement(as, { lang }, children)
    : createElement(as, {}, children);
};

export const Translate: ComponentType<{
  children: ReactNode;
  lang?: string;
  translation?: TranslationType;
}> = ({ children, ...props }) => {
  const up = useTranslation();
  const ctx = { ...up, ...props };
  return (
    <LangText as="div" lang={ctx.lang || ctx.defaultLang}>
      <TContext.Provider value={ctx}>{children}</TContext.Provider>
    </LangText>
  );
};

export const T: ComponentType<{
  children?: ReactNode | DictType | TString;
  tag?: string;
  as?: AsType;
}> = ({ children, tag, as = "span" }) => {
  const ctx = useTranslation();

  const renderString = (tstr: TString) => {
    const ts = tstr.toLang([ctx.lang, ctx.defaultLang]);
    return (
      <LangText as={as} lang={ts.lang || ctx.defaultLang}>
        {ts.toString()}
      </LangText>
    );
  };

  if (children) {
    if (tag) throw new Error(`Please provide tag or children, not both`);

    if (typeof children === "object")
      return renderString(TString.cast(children));

    return (
      <LangText as={as} lang={ctx.defaultLang}>
        {children}
      </LangText>
    );
  }

  if (!tag) throw new Error(`Missing tag or children`);
  if (!ctx.translation) throw new Error(`Context has no translation table`);
  const dict = ctx.translation[tag];
  if (!dict) throw new Error(`No translation for ${tag}`);
  return renderString(new TString(dict));
};
