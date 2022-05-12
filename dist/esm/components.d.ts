import React, { ComponentType, ReactNode } from "react";
import { LangContextProps, AsType, TProps, AsProps, TTextProps, TFormatProps } from "./types";
import { LangContext } from "./context";
export declare const useTranslation: () => LangContext;
export declare const TranslateLocal: ComponentType<LangContextProps & {
    children: ReactNode;
}>;
export declare const Translate: ComponentType<LangContextProps & {
    children: ReactNode;
    as?: AsType;
}>;
export declare const As: ComponentType<AsProps>;
export declare const TText: ComponentType<TTextProps>;
export declare const TFormat: ComponentType<TFormatProps>;
export declare const T: ComponentType<TProps>;
export declare const tBind: (as: AsType) => ComponentType<TProps>;
export declare const tBindMulti: (as: AsType[]) => React.ComponentType<TProps>[];
