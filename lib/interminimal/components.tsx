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

  // Bail out quickly in the simple case
  if (parts.length === 1 && typeof parts[0] === "string")
    return <Fragment>{parts[0]}</Fragment>;

  // Make children into a regular array of nodes
  const params = Children.map<ReactNode, any>(children, x => x) || [];

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
    return clone(params[index - 1]);
  });

  if (ctx.strict && avail.size) throw new Error(`Unused args: ${avail}`);

  if (Object.keys(dict.$$dict).length)
    return <Local dictionary={dict}>{out}</Local>;

  return <Fragment>{out}</Fragment>;
};

export const T: ComponentType<TProps> = ({
  children,
  tag,
  text,
  content,
  count,
  as = "span",
  ...props
}) => {
  const ctx = useTranslation();

  if (content) {
    if (tag || text)
      throw new Error(`Please don't mix content with tag or text`);
    const ts = ctx.castString(content).toLang(ctx.stack);
    // We don't expect this to happen - but it keeps TS quiet
    if (!ts.lang) throw new Error(`No lang on translation`);
    return (
      <TText as={as} lang={ts.lang} {...ctx.resolveProps(props, ts.lang)}>
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
