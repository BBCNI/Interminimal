import React, { ComponentType, ReactNode, ReactElement, Ref, ComponentClass, FunctionComponent } from "react";
import { LangContext, LangContextProps, TextPropType } from "./context";
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
export declare type TranslateProps = LangContextProps & {
    children: ReactNode;
    as?: AsType;
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
export declare const Translate: ComponentType<TranslateProps>;
/**
 * The type of a component - either a string like `"div"` or `"span"` or a React component.
 */
export declare type AsType = string | FunctionComponent<{
    lang?: string;
    ref?: Ref<ReactElement>;
}> | ComponentClass<{
    lang?: string;
    ref?: Ref<ReactElement>;
}, any>;
/**
 * Properties for the `<T>` component.
 */
export interface TProps {
    /**
     * Any children. When `tag` or `text` is also present any children are mapped to the
     * corresponding placeholder
     */
    children?: ReactNode;
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
    /**
     * The element to render as. May be a string (e.g. `"div", "section"`) or a React component.
     */
    as?: AsType;
    /**
     * The remaining properties are passed to the rendered element.
     */
    [key: string]: any;
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
 * See [Using T](/Interminimal/index.html#using-t) for more examples.
 *
 * @category Components
 */
export declare const T: ComponentType<TProps>;
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
export declare const tBind: (as: AsType) => ComponentType<TProps>;
/**
 * Make multiple bound versions of `<T>` at once.
 *
 * ```typescript
 * const [Tli, Tdiv, Th2, Tp] = tBindMulti(["li", "div", "h2", "p"]);
 * ```
 *
 * @category Utilities
 */
export declare const tBindMulti: (as: AsType[]) => React.ComponentType<TProps>[];
