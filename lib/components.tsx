import React, {
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
  ReactElement,
  Ref
} from "react";

import {
  AsType,
  TProps,
  TDictionaryRoot,
  TextPropType,
  TranslateLocalProps,
  TranslateProps
} from "./types";

import { parseTemplate } from "./template";
import { LangContext } from "./context";
import { TString } from "./string";

const TContext = createContext(new LangContext());

/**
 * Hook that gets the currently active translation context. Here's an example
 * of a component that wraps the `Intl.DateTimeFormat` API.
 *
 * ```typescript
 * const TDateFormat: ComponentType<{ date: Date }> = ({ date }) => {
 *   // Get the context
 *   const ctx = useTranslation();
 *   // Use context's languages stack to find a format for our locale
 *   const dtf = new Intl.DateTimeFormat(ctx.languages);
 *   // Find out which language was matched...
 *   const { locale } = dtf.resolvedOptions();
 *   const ts = TString.literal(dtf.format(date), locale);
 *   return <T text={ts} />;
 * };
 * ```
 *
 * @returns the active translation context
 * @category Hooks
 */
export const useTranslation = (): LangContext => useContext(TContext);

/**
 * Wrap components in a nested [[`LangContext`]]. Used to override settings in
 * the context. For example we can add an additional dictionary.
 *
 * ```typescript
 * const Miscount = ({ children }: { children: ReactNode }) => {
 *   // pretend one is three
 *   const dict = { $$dict: { one: { en: "three" } } };
 *   return <TranslateLocal dictionary={dict}>{children}</TranslateLocal>;
 * };
 * ```
 * @category Components
 */
export const TranslateLocal: ComponentType<TranslateLocalProps> = ({
  children,
  ...props
}): ReactElement => {
  const ctx = useTranslation().derive(props);
  return <TContext.Provider value={ctx}>{children}</TContext.Provider>;
};

/**
 * Wrap components in a nested [[`LangContext`]] that establishes a new
 * language stack. By default any children will be wrapped in a `div` with
 * a `lang=` property that indicates the language of the wrapped content.
 *
 * Within this context any content which can't be translated into the requested
 * languages will have it's own `lang=` property to reflect the fact that it
 * is in a different language than expected.
 *
 * ```typescript
 * // Renders as <div lang="cy">....</div>
 * const Welsh: ComponentType<{ children: ReactNode }> = ({ children }) => (
 *   <Translate lang="cy">{children}</Translate>
 * );
 *
 * // Renders as <section lang="cy">....</section>
 * const WelshSection: ComponentType<{ children: ReactNode }> = ({ children }) => (
 *   <Translate as="section" lang="cy">
 *     {children}
 *   </Translate>
 * );
 * ```
 *
 * Unlike [[`TranslateLocal`]] `Translate` always wraps the translated
 * content in an element with a `lang=` property.
 *
 * @category Components
 */
export const Translate: ComponentType<TranslateProps> = ({
  children,
  as = "div",
  ...props
}): ReactElement => {
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

const TText: ComponentType<TTextProps> = forwardRef<ReactElement, TTextProps>(
  ({ children, lang, as, ...props }, ref): ReactElement => {
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
  }
);

TText.displayName = "TText";

interface TFormatProps {
  format: string;
  lang: string;
  children: ReactNode;
  ref?: Ref<ReactElement>;
}

const TFormat: ComponentType<TFormatProps> = forwardRef<
  ReactElement,
  TFormatProps
>(({ format, lang, children }, ref): ReactElement => {
  const clone = (elt: ReactNode, props?: any): ReactNode => {
    if (isValidElement(elt)) return cloneElement(elt, props);
    if (process.env.NODE_ENV !== "production")
      throw new Error(`Can't add props to a non-element`);
  };

  const parts = parseTemplate(format);

  // Bail out quickly in the simple case
  if (parts.length === 1 && typeof parts[0] === "string")
    return <Fragment>{parts[0]}</Fragment>;

  // Make children into a regular array of nodes
  const params = Children.toArray(children);

  if (process.env.NODE_ENV !== "production")
    if (ref && params.length !== 1)
      // Passing a ref is a special case which only allows
      // a single child
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

    // Mark it used
    avail.delete(index);

    // If we're passing a ref clone it in. Only do this to the first
    // parameter. This check pretty redundant - there's a check above
    // that enforces singularity in the ref passed case.
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

const noRef = (ref: Ref<ReactElement>) => {
  if (ref) throw new Error(`Can't pass ref`);
};

function resolveTranslationProps(
  ctx: LangContext,
  tag?: string,
  text?: TextPropType
): TString {
  const r = () => {
    if (process.env.NODE_ENV !== "production")
      if (tag && text) throw new Error(`Got both tag and text`);
    if (text) return ctx.resolve(text);
    if (tag) return ctx.resolve([tag]);
    // istanbul ignore next - can't happen
    throw new Error(`No text or tag`);
  };
  return r().toLang(ctx.languages);
}

/**
 * A wrapper for content that should be translated. It attempts to translate
 * the content you give it according to the active [[`LangContext`]]. It can
 * translate content looked up in the translation dictionary and fat strings
 * (or [[`TString`]]s).
 *
 * It can optionally perform template substitution on the translated text,
 * allowing child components to render portions of the translated text
 * with arbitrary wrappers.
 *
 * By default translated text is wrapped in a `span`. Render a different
 * element using the `as` property.
 *
 * If the wrapped content can't be translated into the context's preferred
 * language it will have a `lang=` property specifying its actual language.
 *
 * The simplest usage is to render translatable content without template
 * substition:
 *
 * ```typescript
 * // Render multilingual content
 * const hi = { en: "Hello", de: "Hallo", fr: "Bonjour" };
 * return <T content={hi} />;
 * // fr: <span>Bonjour</span>
 * ```
 *
 * Template substitution allows you to build whole component trees from a
 * translated string:
 *
 * ```typescript
 * const info = {
 *   en: "Here's a %1[useful link] and here's some %2[italic text]",
 *   fr: "Voici %2[du texte en italique] et un %1[lien utile]",
 *   de: "Hier ist ein %1[nützlicher Link] und hier ein %2[kursiver Text]"
 * };
 * return (
 *   <T as="div" text={info}>
 *     <T as="a" tag="%1" href="/" />
 *     <T as="i" tag="%2" />
 *   </T>
 * );
 * // fr:
 * //   <div>
 * //     Voici <i>du texte en italique</i> et un <a href="/">lien utile</a>
 * //   </div>
 * ```
 *
 * You can also look up and translate dictionary tags:
 *
 * ```typescript
 * // Same as the previous example if `info` is in the dictionary
 * return (
 *   <T as="div" tag="info">
 *     <T as="a" tag="%1" href="/" />
 *     <T as="i" tag="%2" />
 *   </T>
 * );
 * ```
 *
 * @category Components
 */
export const T: ComponentType<TProps> = forwardRef<ReactElement, TProps>(
  (
    { children, tag, text, content, count, as = "span", ...props },
    ref
  ): ReactElement => {
    const ctx = useTranslation();

    if (content) {
      if (process.env.NODE_ENV !== "production") {
        if (tag || text)
          throw new Error(`Please don't mix content with tag or text`);
        noRef(ref);
      }

      const ts = ctx.translate(content);
      return (
        <TText
          as={as}
          lang={ts.language}
          {...ctx.resolveMagicProps(props, ts.language)}
        >
          {ts.toString(count)}
        </TText>
      );
    }

    if (tag || text) {
      const ts = resolveTranslationProps(ctx, tag, text);

      return (
        <TText
          as={as}
          lang={ts.language}
          {...ctx.resolveMagicProps(props, ts.language)}
        >
          <TFormat ref={ref} lang={ts.language} format={ctx.render(ts, count)}>
            {children}
          </TFormat>
        </TText>
      );
    }

    if (process.env.NODE_ENV !== "production") noRef(ref);

    return (
      <TText as={as} lang={ctx.defaultLang} {...ctx.resolveMagicProps(props)}>
        {children}
      </TText>
    );
  }
);

T.displayName = "T";

const boundMap = new Map();

/**
 * Create a new component that behaves like `<T>` but with a different default
 * `as` element.
 *
 * ```typescript
 * const Toption = tBind("option");
 * // later
 * return <Toption value="1" tag="one" />
 * ```
 *
 * It's also possible to wrap React components.
 *
 * ```typescript
 * const TImage = tBind(Image as FunctionComponent);
 * ```
 *
 * The need for the cast is ugly. Not sure how to fix that. PRs welcome...
 *
 * The generated components are cached - so whenever you call `tBind("p")` you
 * will get the same component.
 *
 * @category Utilities
 */
export const tBind = (as: AsType): ComponentType<TProps> => {
  const bind = (as: AsType): ComponentType<TProps> => {
    const bound: ComponentType<TProps> = forwardRef(
      ({ children, ...props }, ref) => (
        <T as={as} ref={ref} {...props}>
          {children}
        </T>
      )
    );
    const asName = typeof as === "string" ? as : as.displayName;
    if (asName) {
      bound.displayName = `T${asName}`;
      Object.defineProperty(bound, "name", { value: bound.displayName });
    }
    return bound;
  };

  let bound = boundMap.get(as);
  if (!bound) boundMap.set(as, (bound = bind(as)));
  return bound;
};

/**
 * Make multiple bound versions of `<T>` at once.
 *
 * ```typescript
 * const [Tli, Tdiv, Th2, Tp] = tBindMulti(["li", "div", "h2", "p"]);
 * ```
 *
 * @category Utilities
 */
export const tBindMulti = (as: AsType[]) => as.map(tBind);
