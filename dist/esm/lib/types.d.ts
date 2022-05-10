import { ComponentClass, FunctionComponent, ReactElement, ReactNode, Ref } from "react";
import { TString } from "./string";
export declare type TPluralType = {
    readonly [key in Intl.LDMLPluralRule]?: string;
};
export declare type TFatString = {
    readonly [key: string]: string | TPluralType;
} & {
    $$dict?: never;
};
declare type TDictionaryType = {
    [key: string]: TFatString | TDictionaryRoot;
} & {
    $$dict?: never;
};
export declare type TDictionaryMeta = {
    [key: string]: string;
};
export declare type TDictionaryRoot = {
    $$dict: TDictionaryType;
    $$meta?: TDictionaryMeta;
};
export declare type AsType = string | FunctionComponent<{
    lang?: string;
    ref?: Ref<ReactElement>;
}> | ComponentClass<{
    lang?: string;
    ref?: Ref<ReactElement>;
}, any>;
export declare type MagicPropsPredicate = (key: string, value: any) => string | undefined;
export interface LangContextProps {
    readonly defaultLang?: string;
    readonly magicProps?: MagicPropsPredicate;
    readonly dictionary?: TDictionaryRoot;
    readonly dictionaryFromTag?: string;
    readonly lang?: string | string[];
    readonly ambient?: string;
}
export declare type StringPropType = TFatString | TString | string;
export declare type TextPropType = TFatString | TString | string | string[];
export interface TProps {
    children?: ReactNode;
    tag?: string;
    text?: TextPropType;
    content?: TextPropType;
    count?: number;
    as?: AsType;
    [key: string]: any;
}
export interface TemplatePlaceholder {
    index: number;
    name?: string;
    text?: string;
}
export declare type TemplateToken = string | TemplatePlaceholder;
export {};
