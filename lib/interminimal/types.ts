import { ComponentClass, FunctionComponent, ReactNode } from "react";
import { TString } from "./index";

export type TPluralType = {
  readonly [key in Intl.LDMLPluralRule]?: string;
};

export type TFatString = {
  readonly [key: string]: string | TPluralType;
} & { $$dict?: never };

export type TDictionaryType = {
  [key: string]: TFatString | TDictionaryRoot;
} & { $$dict?: never };

export type TDictionaryRoot = {
  $$dict: TDictionaryType;
};

export type TextPropType = TFatString | TString | string | string[];

export type AsType =
  | string
  | FunctionComponent<{ lang?: string }>
  | ComponentClass<{ lang?: string }, any>;

export type MagicPropsPredicate = (
  key: string,
  value: any
) => string | undefined;

export interface LangContextProps {
  readonly strict?: boolean;
  readonly defaultLang?: string;
  readonly magicProps?: MagicPropsPredicate;
  readonly dictionary?: TDictionaryRoot;
  readonly lang?: string | string[];
  readonly ambient?: string;
}

export interface TProps {
  children?: ReactNode;
  tag?: string;
  text?: TextPropType;
  count?: number;
  as?: AsType;
  [key: string]: any;
}

export interface TemplatePlaceholder {
  index: number;
  name?: string;
  text?: string;
}

export type TemplateToken = string | TemplatePlaceholder;
