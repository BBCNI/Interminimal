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
      <Local ambient={lang}>
        <As as={as} ref={ref} {...props} lang={lang}>
          {children}
        </As>
      </Local>
    );
  return (
    <As as={as} ref={ref} {...props}>
      {children}
    </As>
  );
});

TText.displayName = "TText";

const clone = (elt: any, props?: any) =>
  isValidElement(elt) ? cloneElement(elt, props) : elt;

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

  const parts = parseTemplate(format);

  // Bail out quickly in the simple case
  if (parts.length === 1 && typeof parts[0] === "string")
    return <Fragment>{parts[0]}</Fragment>;

  // Make children into a regular array of nodes
  const params = Children.map<ReactNode, any>(children, x => x) || [];

  if (ref && params.length !== 1)
    throw new Error(`Can only forward refs to single children`);

  // Set of available indexes
  const avail = new Set(params.map((_x: any, i: number) => i + 1));

  const dict: TDictionaryRoot = { $$dict: {} };

  // Output nodes
  const out = parts.map(part => {
    if (typeof part === "string") return part;
    const { index, name, text } = part;

    if (name && text) dict.$$dict[name] = TString.literal(text, lang).dict;

    if (index < 1 || index > params.length)
      throw new Error(
        `Arg out of range %${index} (1..${params.length} are valid)`
      );

    if (ctx.strict && !avail.has(index))
      throw new Error(`Already using arg %${index}`);

    avail.delete(index);
    return clone(params[index - 1], index === 1 ? { ref } : {});
  });

  if (ctx.strict && avail.size) throw new Error(`Unused args: ${avail}`);

  if (Object.keys(dict.$$dict).length)
    return <Local dictionary={dict}>{out}</Local>;

  return <Fragment>{out}</Fragment>;
});

TFormat.displayName = "TFormat";

export const T: ComponentType<TProps> = forwardRef<ReactElement, TProps>(
  ({ children, tag, text, content, count, as = "span", ...props }, ref) => {
    const ctx = useTranslation();

    if (content) {
      if (tag || text)
        throw new Error(`Please don't mix content with tag or text`);
      const ts = ctx.castString(content).toLang(ctx.stack);
      // We don't expect this to happen - but it keeps TS quiet
      if (!ts.lang) throw new Error(`No lang on translation`);
      return (
        <TText
          as={as}
          ref={ref}
          lang={ts.lang}
          {...ctx.resolveProps(props, ts.lang)}
        >
          {ts.toString(count)}
        </TText>
      );
    }

    if (tag || text) {
      const ts = ctx.resolve(tag, text);
      // We don't expect this to happen - but it keeps TS quiet
      if (!ts.lang) throw new Error(`No lang on translation`);

      return (
        <TText as={as} lang={ts.lang} {...ctx.resolveProps(props, ts.lang)}>
          <TFormat lang={ts.lang} format={ctx.render(ts, count)}>
            {children}
          </TFormat>
        </TText>
      );
    }

    return (
      <TText as={as} ref={ref} {...ctx.resolveProps(props)}>
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
