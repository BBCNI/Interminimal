import { TString } from "./string";
import { LangContextProps, TextPropType, StringPropType } from "./types";
export declare class LangContext {
    readonly defaultLang: string;
    private readonly parent?;
    private readonly lang;
    private readonly ambient?;
    private readonly dictionary?;
    private readonly ls;
    private stackCache;
    private tagCache;
    constructor(props?: LangContextProps & {
        parent?: LangContext;
    });
    private get stack();
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
    private findTag;
    private resolveTag;
    private resolveDictionary;
    resolveTranslationProps(tag?: string, text?: TextPropType): TString;
    resolveMagicProps<T>(props: T, lang?: string): T;
    render(ts: TString, count?: number): string;
}
