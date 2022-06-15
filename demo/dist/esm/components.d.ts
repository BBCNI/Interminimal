import React, { ComponentType, ReactNode, ReactElement, ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, PropsWithChildren } from "react";
import { LangContext, LangContextProps, TextPropType } from "./context";
declare type TPrefix<T> = {
    [P in keyof T as `t-${string & P}`]?: T[P] | [string];
};
declare type PolyRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];
declare type AsProperty<C extends ElementType> = {
    as?: C;
};
declare type PropsToOmit<C extends ElementType, P> = keyof (AsProperty<C> & P);
declare type WithName<T> = T & {
    displayName?: string | undefined;
};
declare type PolyProp<C extends ElementType, Props = {}> = PropsWithChildren<Props & AsProperty<C>> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
declare type PolyPropRef<C extends ElementType, Props = {}> = PolyProp<C, Props> & {
    ref?: PolyRef<C>;
};
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
export declare const useTranslation: () => LangContext;
export declare type TranslateLocalProps = LangContextProps & {
    children: ReactNode;
};
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
export declare const TranslateLocal: ComponentType<TranslateLocalProps>;
declare type TranslateProps<C extends ElementType> = PolyProp<C, LangContextProps>;
declare type TranslateComponent = WithName<(<C extends ElementType = "div">(props: TranslateProps<C>) => ReactElement | null)>;
/**
 * Wrap components in a nested [[`LangContext`]] that establishes a new
 * language stack. By default any children will be wrapped in a `div` with
 * a `lang=` property that indicates the language of the wrapped content.
 *
 * Within this context any content which can't be translated into the requested
 * languages will have its own `lang=` property to reflect the fact that it
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
export declare const Translate: TranslateComponent;
declare type AsProps<C extends ElementType> = PolyPropRef<C>;
declare type AsComponent = WithName<(<C extends ElementType = "span">(props: AsProps<C>) => ReactElement | null)>;
export declare const As: AsComponent;
declare type TTextProps<C extends ElementType> = PolyPropRef<C, {
    lang: string;
}>;
declare type TTextComponent = WithName<(<C extends ElementType = "span">(props: TTextProps<C>) => ReactElement | null)>;
export declare const TText: TTextComponent;
/**
 * Properties for the `<T>` component.
 */
export declare type TProps<C extends ElementType> = PolyPropRef<C, {
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
}> & TPrefix<ComponentPropsWithoutRef<C>>;
declare type TComponent = WithName<(<C extends ElementType = "span">(props: TProps<C>) => ReactElement | null)>;
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
export declare const T: TComponent;
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
export declare const tBind: <C extends React.ElementType<any>>(as: C) => React.ComponentType<TProps<C>>;
export {};
