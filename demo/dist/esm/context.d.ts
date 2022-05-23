import { TString } from "./string";
import { TextPropType, StringPropType } from "./types";
import { LocaleStack } from "./resolveLocale";
import { TDictionaryRoot } from "./dictionary";
/**
 * Properties that can be passed to [[`LangContext.constructor`]] and [[`LangContext.derive`]]
 */
export interface LangContextProps {
    /**
     * The default language for the context. Untranslated text will be assumed to be in this
     * language. Setting `defaultLang` also places the default in the language stack before
     * any languages in `lang`
     */
    readonly defaultLang?: string;
    /**
     * A dictionary to resolve translations. Dictionaries are consulted in order walking up the
     * context parent chain.
     */
    readonly dictionary?: TDictionaryRoot;
    /**
     * Use a tagged section of a current dictionary as the new dictionary.
     */
    readonly dictionaryFromTag?: string;
    /**
     * A language or list of languages that are preferred for this context. Any languages provided
     * here are prepended to the parent's language stack.
     */
    readonly lang?: string | readonly string[];
    /**
     * Set the ambient language - which is used to create a context which can't match the desired
     * language. The ambience is used to add `lang` attributes to elements that aren't in the
     * expected language.
     */
    readonly ambient?: string;
}
/**
 * A language context. All translation takes place inside a context and contexts
 * nest to allow their configuration to be modified. Normally you'll get a context
 * using the [[`useTranslation`]] hook.
 *
 * @category Classes
 */
export declare class LangContext {
    /**
     * The default language for this context. Used for any non-translated content.
     */
    readonly defaultLang: string;
    /** @ignore */
    private readonly stack;
    /** @ignore */
    private readonly parent?;
    /** @ignore */
    private readonly ambient?;
    /** @ignore */
    private readonly dictionary;
    /**
     * Create a new LangContext. Normally you won't need to do this; the root
     * context is initialised by _Interminimal_ and child contexts are created
     * using [[`derive`]]. In React use the [[`useTranslation`]] to get the active
     * [[`LangContext`]].
     *
     * @param props initial properties for this context
     */
    constructor(props?: LangContextProps & {
        parent?: LangContext;
    });
    /**
     * Get the language preference stack for this context. The `languages`
     * array is always normalised - duplicates are removed.
     *
     * ```typescript
     * const ctx = new LangContext({ lang: "cy", defaultLang: "en" });
     * expect(ctx.languages).toEqual(["cy", "en"]);
     *
     * const ctx2 = ctx.derive({ lang: "de", defaultLang: "fr" });
     * expect(ctx2.languages).toEqual(["de", "fr", "cy", "en"]);
     *
     * // "en" de-duplicated from languages
     * const ctx3 = ctx2.derive({ lang: "en" });
     * expect(ctx3.languages).toEqual(["en", "de", "fr", "cy"]);
     *
     * // Start from scratch with an explicit lang stack
     * const ctx4 = new LangContext({ lang: ["en", "de", "fr", "cy"] });
     *
     * // All equivalent stacks are the same object
     * expect(ctx4.languages).toBe(ctx3.languages);
     * ```
     *
     * Equivalent language arrays are always the same object. This makes
     * it possible to use `languages` in e.g. `React.useMemo()` to
     * perform expensive operations only when the language stack changes.
     *
     */
    get languages(): string[];
    /**
     * The context's language expanded for searching. The expansion of a
     * particular language stack is canonicalised and cached - different
     * contexts with the same [[`languages`]] will have the same `search`
     * property too.
     *
     * ```typescript
     * const ctx = new LangContext({
     *   lang: ["en-GB-x-foo", "en-US", "fr-CA", "de-AT"]
     * });
     * // Search path expands and groups tags
     * console.log(ctx.search);
     * // [
     * //   "en-GB-x-foo",
     * //   "en-GB",
     * //   "en-US",
     * //   "en",
     * //   "fr-CA",
     * //   "fr",
     * //   "de-AT",
     * //   "de"
     * // ]
     * ```
     *
     * The rules for tag expansion are slightly subtle. Notice in the
     * example above that "en" is only injected after both "en-GB"
     * and "en-US".
     */
    get search(): string[];
    /**
     * The current language. This is the same as the first element of the [[`languages`]] array.
     */
    get language(): string;
    /**
     * The ambient language. This is defined in contexts which can't match the desired language
     * so that a `lang=` attribute can be added to nested elements
     */
    get ambience(): string;
    /**
     * Create a new context nested below this one overriding any properties as desired.
     *
     * ```typescript
     * const root = new LangContext({ lang: ["en-GB"], defaultLang: "en" });
     * const welsh = root.derive({ lang: "cy" });
     * console.log(welsh.languages); // ['cy', 'en-GB', 'en']
     * ```
     *
     * @param props properties to override
     * @returns a nested context
     */
    derive(props: LangContextProps): LangContext;
    /**
     * Resolve a `[tag]`, string, TString, fat string and translate it according
     * to this context's languages.
     *
     * @param text the thing to translate
     * @returns a TString with the best language match selected
     */
    translate(text: TextPropType): TString;
    /**
     * This is a convenience method which may be useful when wrapping components
     * that don't work well with _Interminimal_. For example here's how we can set
     * the page title using NextJS's `Head` component.
     *
     * ```typescript
     * // Inject page title into a NextJS <Head> component. We have to do the
     * // translation explicitly because we can't nest a T inside a Head
     * // Use this component *outside* of any other <Head></Head>
     * const TTitle: ComponentType<TTitleProps> = ({ text, ...rest }) => {
     *   // Translate text and props
     *   const { str, props } = useTranslation().translateTextAndProps(text, rest);
     *   return (
     *     <Head>
     *       <title {...props}>{str}</title>
     *     </Head>
     *   );
     * };
     * ```
     *
     * @param text the text to translate
     * @param props a React style props object
     * @param count how many of a thing we have for pluralisation
     * @returns an object `{ str, props }` containing the translated text and properties.
     */
    translateTextAndProps(text: TextPropType, { lang, ...props }?: {
        lang?: string;
        [key: string]: any;
    }, count?: number): {
        str: string;
        props: {};
    };
    /**
     * Turn something stringy into a TString. A plain string turns into a TString
     * with its language set to [[`defaultLang`]].
     *
     * @param text a string, TString or fat string
     * @returns a TString that represents `text`
     */
    castString(text: StringPropType): TString;
    /**
     * Resolve a text property which can be
     *
     * * a single element array containing the name of a tag
     * * an existing TString or TFatString
     * * a plain string
     *
     * Tags are resolved against the dictionary chain. Plain strings
     * are converted into a TString with the context's [[`defaultLang`]].
     *
     * @param text `[tag]`, a TString or a plain JS string
     * @returns a `TString` containing the translation
     */
    resolve(text: TextPropType): TString;
    /** @ignore */
    private lookupTag;
    /**
     * Check whether this context can resolve a particular tag. Use it to guard
     * translation tags which might be missing.
     *
     * @param tag the dictionary tag to check
     * @returns true if `tag` can be resolved
     */
    hasTag(tag: string): boolean;
    /** @ignore */
    private findTag;
    /** @ignore */
    private resolveTag;
    /** @ignore */
    private resolveDictionary;
    /**
     * Get a new language stack that prepends languages to the context's stack.
     *
     * ```typescript
     * const ctx = new LangContext({lang:"en"});
     * console.log(ctx.resolveLocales(["cy"])); // ["cy", "en"]
     * ```
     *
     * @param langs languages to prepend to context's stack
     * @returns a language array that prepends `langs` to the context's stack
     */
    resolveLocales(langs: string[]): LocaleStack;
    /**
     * Translate a React style props object by replacing any `t-foo` properties with
     * `foo` containing translated text. The value of any `t-*` properties should be
     * capable of being resolved by [[`resolve`]].
     *
     * @param props a properties object to translate
     * @param lang an additional language to add to the context's stack
     * @returns a new props object with `t-*` entries translated
     */
    resolveMagicProps<T>(props: T, lang?: string): T;
    /**
     * Convert a [[`TString`]] to a string expanding any `%{tag}` expansions. Expansions
     * are recursively looked up in the dictionary chain. Any `%` that isn't part of
     * a tag expansion should be escaped as `%%`
     *
     * @param ts the string to render
     * @param count the number of things in case of pluralisation
     * @returns a string with any `%{tag}` references resolved.
     */
    render(ts: TString, count?: number): string;
}
