import { TString } from "./string";
import { LangContextProps, TextPropType, StringPropType } from "./types";
/** A language context. Each nested <Translate> gets a new one of these */
export declare class LangContext {
    readonly defaultLang: string;
    /** @ignore */
    private readonly parent?;
    /** @ignore */
    private readonly ambient?;
    /** @ignore */
    private readonly dictionary?;
    /** @ignore */
    private readonly locale;
    /** @ignore */
    private stackCache;
    /** @ignore */
    private tagCache;
    constructor(props?: LangContextProps & {
        parent?: LangContext;
    });
    /** @ignore */
    private get stack();
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
    get language(): string;
    get ambience(): string;
    derive(props: LangContextProps): LangContext;
    translate(text: TextPropType): TString;
    translateTextAndProps(text: TextPropType, { lang, ...props }?: {
        lang?: string;
        [key: string]: any;
    }, count?: number): {
        str: string;
        props: {};
    };
    castString(text: StringPropType): TString;
    resolve(text: TextPropType): TString;
    /** @ignore */
    private findTag;
    /** @ignore */
    private resolveTag;
    /** @ignore */
    private resolveDictionary;
    resolveTranslationProps(tag?: string, text?: TextPropType): TString;
    resolveLocales(langs: string[]): readonly string[];
    static canonicaliseLocales(langs: string[]): readonly string[];
    resolveMagicProps<T>(props: T, lang?: string): T;
    render(ts: TString, count?: number): string;
}
