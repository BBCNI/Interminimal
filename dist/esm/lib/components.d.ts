import React, { ComponentType, ReactNode } from "react";
import { LangContextProps, AsType, TProps } from "./types";
import { LangContext } from "./context";
export declare const useTranslation: () => LangContext;
export declare const TranslateLocal: ComponentType<LangContextProps & {
    children: ReactNode;
}>;
export declare const Translate: ComponentType<LangContextProps & {
    children: ReactNode;
    as?: AsType;
}>;
interface TTextProps {
    children: ReactNode;
    lang: string;
    as: AsType;
    [key: string]: any;
}
export declare const TText: ComponentType<TTextProps>;
interface TFormatProps {
    format: string;
    lang: string;
    children?: ReactNode;
}
export declare const TFormat: ComponentType<TFormatProps>;
export declare const T: ComponentType<TProps>;
export declare const tBind: (as: AsType) => ComponentType<TProps>;
export declare const tBindMulti: (as: AsType[]) => React.ComponentType<TProps>[];
export {};
