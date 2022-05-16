import React, { ComponentType } from "react";
import { AsType, TProps, TranslateLocalProps, TranslateProps } from "./types";
import { LangContext } from "./context";
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
export declare const useTranslation: () => LangContext;
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
 * A wrapper for content that should be translated. It attempts to translate
 * the content you give it according to the active [[`LangContext`]]. It can
 * translate content looked up in the translation dictionary and fat strings
 * (or [[`TString`]]s).
 *
 * It can optionally perform template substitution on the translated text
 * allowing child components to render portions of the translated text
 * with arbitrary wrappers.
 *
 * By default translated text is wrapped in a `span`. Render a different
 * element using the `as` property.
 *
 * If the wrapped content can't be translated into the context's preferred
 * language it will have a `lang=` property specifying its actual language.
 *
 *
 *
 * @category Components
 */
export declare const T: ComponentType<TProps>;
/**
 * @category Utilities
 */
export declare const tBind: (as: AsType) => ComponentType<TProps>;
/**
 * @category Utilities
 */
export declare const tBindMulti: (as: AsType[]) => React.ComponentType<TProps>[];
