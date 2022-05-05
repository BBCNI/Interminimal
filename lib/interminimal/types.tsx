import { ComponentClass, FunctionComponent, ReactNode } from "react";
import { TString } from "./index";

export interface TPluralType {
  readonly [key: string]: string;
}

export interface TFatString {
  readonly [key: string]: string | TPluralType;
}

export interface TDictionaryType {
  [key: string]: TFatString;
}

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
  readonly dictionary?: TDictionaryType;
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
