import {
  ComponentClass,
  ComponentType,
  createContext,
  createElement,
  FunctionComponent,
  ReactNode,
  Children,
  useContext,
  Fragment,
  cloneElement,
  isValidElement
} from "react";

export interface TPluralType {
  readonly [key: string]: string;
}

export interface TDictType {
  readonly [key: string]: string | TPluralType;
}

export interface TTranslationType {
  readonly [key: string]: TDictType;
}

type TextPropType = TDictType | TString | string | string[];

type AsType =
  | string
  | FunctionComponent<{ lang?: string }>
  | ComponentClass<{ lang?: string }, any>;

type MagicPropsPredicate = (value: any, key: string) => string | undefined;

interface LangContextProps {
  readonly strict?: boolean;
  readonly defaultLang?: string;
  readonly magicProps?: MagicPropsPredicate;
  readonly translation?: TTranslationType;
  readonly lang?: string;
  readonly ambient?: string;
}

const defaultMagicProps: MagicPropsPredicate = (k: string, v: any) => {
  const m = k.match(/^(\w+)Text$/);
  if (m) return m[1];
};

class LangContext {
  readonly strict: boolean = true;
  readonly defaultLang: string = "en";
  readonly magicProps: MagicPropsPredicate = defaultMagicProps;
  readonly lang?: string;
  readonly ambient?: string;
  readonly translation?: TTranslationType;

  constructor(props: LangContextProps = {}) {
    Object.assign(this, props);
  }

  derive(props: LangContextProps = {}) {
    return new LangContext({ ...this, ...props });
  }

  resolveText(text: TextPropType) {
    if (Array.isArray(text)) return this.resolveTag(text[0]);
    if (typeof text === "string")
      return TString.literal(text, this.defaultLang);
    return TString.cast(text);
  }

  resolveTag(tag: string) {
    const { translation } = this;
    if (!translation) throw new Error(`Context has no translation table`);
    const dict = translation[tag];
    if (!dict) throw new Error(`No translation for ${tag}`);
    return TString.cast(dict);
  }

  resolve(tag?: string, text?: TextPropType) {
    const r = () => {
      if (tag && text) throw new Error(`Got both tag and text`);
      if (text) return this.resolveText(text);
      if (tag) return this.resolveTag(tag);
      throw new Error(`No text or tag`);
    };
    return r().toLang([this.lang || this.defaultLang, this.defaultLang]);
  }

  resolveProps(props: { [key: string]: any }, lang?: string) {
    const { magicProps } = this;
    if (!magicProps) return props;

    const pairs = Object.entries(props).map(([k, v]) => {
      const nk = magicProps(k, v);
      if (nk)
        return [
          nk,
          this.resolveText(v).toLang([
            lang || this.lang || this.defaultLang,
            this.lang || this.defaultLang,
            this.defaultLang
          ])
        ];

      return [k, v];
    });

    return Object.fromEntries(pairs);
  }
}

const TContext = createContext<LangContext>(new LangContext({}));

export class TString {
  readonly dict: TDictType;
  readonly lang?: string;

  constructor(dict: TDictType, lang?: string) {
    if (lang && !(lang in dict)) throw new Error(`${lang} not in dictionary`);
    this.dict = dict;
    this.lang = lang;
  }

  static cast(obj: TDictType | TString, lang?: string) {
    if (obj instanceof this) return obj;
    return new this(obj as TDictType, lang);
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

  toLang(langs: string | string[]): TString {
    if (!Array.isArray(langs)) return this.toLang([langs]);
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

export const useTranslation = () => useContext<LangContext>(TContext);

// Set the ambient language
export const Ambience: ComponentType<{
  children: ReactNode;
  ambient: string;
}> = ({ children, ...props }) => {
  const ctx = useTranslation().derive(props);
  return <TContext.Provider value={ctx}>{children}</TContext.Provider>;
};

export const Translate: ComponentType<{
  children: ReactNode;
  lang?: string;
  ambient?: string;
  translation?: TTranslationType;
  as?: AsType;
}> = ({ children, as = "div", ...props }) => {
  const ctx = useTranslation().derive(props);
  return (
    <TText as={as} lang={ctx.lang || ctx.defaultLang}>
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
  const ambient = ctx.ambient || ctx.lang || ctx.defaultLang;

  if (lang !== ambient)
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

const clone = (elt: any) => (isValidElement(elt) ? cloneElement(elt) : elt);

export const TFormat: ComponentType<{
  format: string;
  children?: ReactNode;
}> = ({ format, children }) => {
  const ctx = useTranslation();
  // Parse format string
  const parts = format.split(/%(%|\d+)/);

  // Make children into a regular array of nodes
  const params = Children.map<ReactNode, any>(children, x => x) || [];

  // Set of available indexes
  const avail = new Set(params.map((_x: any, i: number) => i + 1));

  // Output nodes
  const out = [];

  while (parts.length) {
    const [frag, arg] = parts.splice(0, 2);
    if (frag.length) out.push(frag);
    if (arg) {
      // Allow '%%' to escape '%'
      if (arg === "%") {
        out.push(arg);
        continue;
      }

      const idx = Number(arg);
      if (idx < 1 || idx > params.length)
        throw new Error(
          `Arg out of range %${idx} (1..${params.length} are valid)`
        );

      if (ctx.strict && !avail.has(idx))
        throw new Error(`Already using arg %${idx}`);

      avail.delete(idx);
      out.push(clone(params[idx - 1]));
    }
  }

  if (ctx.strict && avail.size) throw new Error(`Unused args: ${avail}`);

  return <Fragment>{out}</Fragment>;
};

interface TProps {
  children?: ReactNode;
  tag?: string;
  text?: TextPropType;
  count?: number;
  as?: AsType;
  [key: string]: any;
}

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
    const lang = ts.lang || ctx.defaultLang;

    return (
      <TText as={as} lang={lang} {...ctx.resolveProps(props, lang)}>
        <TFormat format={ts.toString(count)}>{children}</TFormat>
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
    const baked: ComponentType<TProps> = ({ children, ...props }) => (
      <T as={as} {...props}>
        {children}
      </T>
    );
    const asName = typeof as === "string" ? as : as.displayName;
    for (const prop of ["name", "displayName"])
      Object.defineProperty(baked, prop, { value: `T${asName}` });
    return baked;
  };

  let bound = boundMap.get(as);
  if (!bound) boundMap.set(as, (bound = bind(as)));
  return bound;
};

export const tBindMulti = (as: AsType[]) => as.map(tBind);
