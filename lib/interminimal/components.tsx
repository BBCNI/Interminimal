import {
  ComponentType,
  createContext,
  createElement,
  ReactNode,
  Children,
  useContext,
  Fragment,
  cloneElement,
  isValidElement,
  forwardRef,
  ReactElement
} from "react";

import { parseTemplate } from "./template";
import { LangContextProps, AsType, TProps, TDictionaryRoot } from "./types";
import { LangContext } from "./context";
import { TString } from "./string";

const TContext = createContext(new LangContext());

export const useTranslation = (): LangContext => useContext(TContext);

export const TranslateLocal: ComponentType<
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

interface AsProps {
  as: AsType;
  children?: ReactNode;
  [key: string]: any;
}

// Create a component with the specified tag
const As: ComponentType<AsProps> = forwardRef<ReactElement, AsProps>(
  ({ as, children, ...props }, ref) =>
    createElement(as, { ref, ...props }, children)
);

As.displayName = "As";

interface TTextProps {
  children: ReactNode;
  lang: string;
  as: AsType;
  [key: string]: any;
}

export const TText: ComponentType<TTextProps> = forwardRef<
  ReactElement,
  TTextProps
>(({ children, lang, as, ...props }, ref) => {
  const ctx = useTranslation();

  if (lang !== ctx.ambience)
    return (
      <TranslateLocal ambient={lang}>
        <As as={as} ref={ref} {...props} lang={lang}>
          {children}
        </As>
      </TranslateLocal>
    );
  return (
    <As as={as} ref={ref} {...props}>
      {children}
    </As>
  );
});

TText.displayName = "TText";

interface TFormatProps {
  format: string;
  lang: string;
  children?: ReactNode;
}

export const TFormat: ComponentType<TFormatProps> = forwardRef<
  ReactElement,
  TFormatProps
>(({ format, lang, children }, ref) => {
  const ctx = useTranslation();

  const clone = (elt: ReactNode, props?: any): ReactNode =>
    isValidElement(elt) ? cloneElement(elt, props) : elt;

  const parts = parseTemplate(format);

  // Bail out quickly in the simple case
  if (parts.length === 1 && typeof parts[0] === "string")
    return <Fragment>{parts[0]}</Fragment>;

  // Make children into a regular array of nodes
  const params = Children.map<ReactNode, any>(children, x => x) || [];

  if (process.env.NODE_ENV !== "production")
    if (ref && params.length !== 1)
      throw new Error(`Can only forward refs to single children`);

  // Set of available indexes
  const avail = new Set(params.map((_x: any, i: number) => i + 1));

  const dict: TDictionaryRoot = { $$dict: {} };

  // Output nodes
  const out = parts.map(part => {
    if (typeof part === "string") return part;
    const { index, name, text } = part;

    if (name && text)
      dict.$$dict[name] = TString.literal(text, lang).dictionary;

    if (index < 1 || index > params.length)
      throw new Error(
        `Arg out of range %${index} (1..${params.length} are valid)`
      );

    if (!avail.has(index)) throw new Error(`Already using arg %${index}`);

    // Mark it used (at least once)
    avail.delete(index);

    if (ref && index === 1) return clone(params[index - 1], { ref });
    return params[index - 1];
  });

  if (process.env.NODE_ENV !== "production")
    if (avail.size) throw new Error(`Unused args: ${avail}`);

  if (Object.keys(dict.$$dict).length)
    return <TranslateLocal dictionary={dict}>{out}</TranslateLocal>;

  return <Fragment>{out}</Fragment>;
});

TFormat.displayName = "TFormat";

export const T: ComponentType<TProps> = forwardRef<ReactElement, TProps>(
  ({ children, tag, text, content, count, as = "span", ...props }, ref) => {
    const ctx = useTranslation();

    if (content) {
      if (tag || text)
        throw new Error(`Please don't mix content with tag or text`);
      const ts = ctx.translate(content);
      return (
        <TText
          as={as}
          ref={ref}
          lang={ts.language}
          {...ctx.resolveMagicProps(props, ts.language)}
        >
          {ts.toString(count)}
        </TText>
      );
    }

    if (tag || text) {
      const ts = ctx.resolveTranslationProps(tag, text);

      return (
        <TText
          as={as}
          lang={ts.language}
          {...ctx.resolveMagicProps(props, ts.language)}
        >
          <TFormat lang={ts.language} format={ctx.render(ts, count)}>
            {children}
          </TFormat>
        </TText>
      );
    }

    return (
      <TText
        as={as}
        ref={ref}
        lang={ctx.defaultLang}
        {...ctx.resolveMagicProps(props)}
      >
        {children}
      </TText>
    );
  }
);

T.displayName = "T";

const boundMap = new Map();

export const tBind = (as: AsType): ComponentType<TProps> => {
  const bind = (as: AsType): ComponentType<TProps> => {
    const bound: ComponentType<TProps> = forwardRef(
      ({ children, ...props }, ref) => (
        <T as={as} ref={ref} {...props}>
          {children}
        </T>
      )
    );
    const asName =
      typeof as === "string" ? as : as.displayName ?? as.name ?? "anon";
    bound.displayName = `T${asName}`;
    Object.defineProperty(bound, "name", { value: bound.displayName });
    return bound;
  };

  let bound = boundMap.get(as);
  if (!bound) boundMap.set(as, (bound = bind(as)));
  return bound;
};

export const tBindMulti = (as: AsType[]) => as.map(tBind);
