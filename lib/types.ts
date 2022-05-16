import {
  ComponentClass,
  FunctionComponent,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import { TString } from "./string";

export type TPluralType = {
  readonly [key in Intl.LDMLPluralRule]?: string;
};

export type TFatString = {
  readonly [key: string]: string | TPluralType;
} & { $$dict?: never };

type TDictionaryType = {
  [key: string]: TFatString | TDictionaryRoot;
} & { $$dict?: never };

export type TDictionaryMeta = {
  [key: string]: string;
};

export type TDictionaryRoot = {
  $$dict: TDictionaryType;
  $$meta?: TDictionaryMeta;
};

export type AsType =
  | string
  | FunctionComponent<{ lang?: string; ref?: Ref<ReactElement> }>
  | ComponentClass<{ lang?: string; ref?: Ref<ReactElement> }, any>;

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
  readonly lang?: string | string[];
  /**
   * Set the ambient language - which is used to create a context which can't match the desired
   * language. The ambience is used to add `lang` attributes to elements that aren't in the
   * expected language.
   */
  readonly ambient?: string;
}

export type StringPropType = TFatString | TString | string;
export type TextPropType = TFatString | TString | string | string[];

export type TranslateLocalProps = LangContextProps & { children: ReactNode };

export type TranslateProps = LangContextProps & {
  children: ReactNode;
  as?: AsType;
};

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

export type TemplateToken = string | TemplatePlaceholder;
