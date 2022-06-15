import React, {
  ComponentType,
  createContext,
  ReactNode,
  Children,
  useContext,
  Fragment,
  cloneElement,
  isValidElement,
  forwardRef,
  ReactElement,
  Ref,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren
} from "react";

import { parseTemplate } from "./template";
import { LangContext, LangContextProps, TextPropType } from "./context";
import { TString } from "./string";
import { TDictionaryRoot } from "./dictionary";

type TPrefix<T> = {
  [P in keyof T as `t-${string & P}`]?: T[P] | [string];
};

type PolyRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];
type AsProperty<C extends ElementType> = { as?: C };
type PropsToOmit<C extends ElementType, P> = keyof (AsProperty<C> & P);
type WithName<T> = T & { displayName?: string | undefined };

type PolyProp<C extends ElementType, Props = {}> = PropsWithChildren<
  Props & AsProperty<C>
> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolyPropRef<C extends ElementType, Props = {}> = PolyProp<C, Props> & {
  ref?: PolyRef<C>;
};

const TContext = createContext(new LangContext());

/**
 * Hook that gets the currently active translation context. Here's an example
 * of a component that wraps the `Intl.DateTimeFormat` API using the translation
 * context.
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

export type TranslateLocalProps = LangContextProps & { children: ReactNode };

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

type TranslateProps<C extends ElementType> = PolyProp<C, LangContextProps>;

type TranslateComponent = WithName<
  <C extends ElementType = "div">(
    props: TranslateProps<C>
  ) => ReactElement | null
>;

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
export const Translate: TranslateComponent = <C extends ElementType = "div">({
  as,
  children,
  ...props
}: TranslateProps<C>) => {
  const ctx = useTranslation().derive(props);
  return (
    <TText as={as || ("div" as ElementType)} lang={ctx.language}>
      <TContext.Provider value={ctx}>{children}</TContext.Provider>
    </TText>
  );
};

type AsProps<C extends ElementType> = PolyPropRef<C>;

type AsComponent = WithName<
  <C extends ElementType = "span">(props: AsProps<C>) => ReactElement | null
>;

export const As: AsComponent = forwardRef(
  <C extends ElementType = "span">(
    { as, children, ...rest }: AsProps<C>,
    ref?: PolyRef<C>
  ) => {
    const Component = as || "span";
    return (
      <Component {...rest} ref={ref}>
        {children}
      </Component>
    );
  }
);

As.displayName = "As";

type TTextProps<C extends ElementType> = PolyPropRef<C, { lang: string }>;

type TTextComponent = WithName<
  <C extends ElementType = "span">(props: TTextProps<C>) => ReactElement | null
>;

export const TText: TTextComponent = forwardRef(
  <C extends ElementType = "span">(
    { as, lang, children, ...props }: TTextProps<C>,
    ref?: PolyRef<C>
  ) => {
    const ctx = useTranslation();

    if (lang !== ctx.ambience) {
      const ctxProps = ctx.retainAmbience ? { lang: lang } : { ambient: lang };
      return (
        <TranslateLocal {...ctxProps}>
          <As
            as={as || ("span" as ElementType)}
            ref={ref}
            {...props}
            lang={lang}
          >
            {children}
          </As>
        </TranslateLocal>
      );
    }

    return (
      <As as={as || ("span" as ElementType)} ref={ref} {...props}>
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

const TFormat: ComponentType<TFormatProps> = forwardRef(
  ({ format, lang, children }: TFormatProps, ref): ReactElement => {
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
  }
);

TFormat.displayName = "TFormat";

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
 * Properties for the `<T>` component.
 */
export type TProps<C extends ElementType> = PolyPropRef<
  C,
  {
    /**
     * A tag to look up in the current dictionary and perform template substitution on.
     */
    tag?: string;
    /**
     * Text to translate. Can also refer to a dictionary tag if it's a single element array:
     * `["tag"]`. The resolved text is processed with template substitution.
     */
    text?: TextPropType;
    /**
     * Text to translate without any further template substitution. Use for e.g. literal
     * translated text from an API.
     */
    content?: TextPropType;
    /**
     * The number of the thing being described for cases where the translation provides
     * pluralisation rules. Defaults to 1.
     */
    count?: number;

    children?: ReactNode;
  }
> &
  TPrefix<ComponentPropsWithoutRef<C>>;

type TComponent = WithName<
  <C extends ElementType = "span">(props: TProps<C>) => ReactElement | null
>;

const noRef = (ref: PolyRef<any>) => {
  if (ref) throw new Error(`Can't pass ref`);
};

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
 * See [Using T](/Interminimal/index.html#using-t) for more examples.
 *
 * @category Components
 */
export const T: TComponent = forwardRef(
  <C extends ElementType = "span">(
    { as, tag, text, content, count, children, ...props }: TProps<C>,
    ref?: PolyRef<C>
  ) => {
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
          as={as || ("span" as ElementType)}
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
          as={as || ("span" as ElementType)}
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
      <TText
        as={as || ("span" as ElementType)}
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
 * const TImage = tBind(Image);
 * ```
 *
 * The generated components are cached - so whenever you call `tBind("p")` you
 * will get the same component.
 *
 * @category Utilities
 */
export const tBind = <C extends ElementType>(
  as: C
): ComponentType<TProps<C>> => {
  const bind = (as: C) => {
    const bound = forwardRef(
      <C extends ElementType>(
        { children, ...props }: TProps<C>,
        ref?: PolyRef<C>
      ) => (
        // @ts-ignore hmm...
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
