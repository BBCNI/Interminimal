import { TString } from "./string";
import { MagicPropsPredicate, LangContextProps, TextPropType, TDictionaryRoot, StringPropType } from "./types";
export declare class LangContext {
    readonly parent?: LangContext;
    readonly defaultLang: string;
    readonly magicProps: MagicPropsPredicate;
    readonly lang: string[];
    readonly ambient?: string;
    readonly dictionary?: TDictionaryRoot;
    private stackCache;
    private tagCache;
    constructor(props?: LangContextProps);
    get stack(): readonly string[];
    get language(): string;
    get ambience(): string;
    derive(props?: LangContextProps): LangContext;
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
    private findTag;
    private resolveTag;
    private resolveDictionary;
    resolveTranslationProps(tag?: string, text?: TextPropType): TString;
    resolveMagicProps<T>(props: T, lang?: string): T;
    render(ts: TString, count?: number): string;
}
