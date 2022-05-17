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

/**
 * The root of a translation dictionary
 */
export type TDictionaryRoot = {
  /** the translations */
  $$dict: TDictionaryType;
  /** optional metadata - ignored by _Interminimal_ */
  $$meta?: TDictionaryMeta;
};

/**
 * The type of a component - either a string like `"div"` or `"span"` or a React component.
 */
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

/**
 * Properties for the `<T>` component.
 */
export interface TProps {
  /**
   * Any children. When `tag` or `text` is also present any children are mapped to the
   * corresponding placeholder
   */
  children?: ReactNode;
  /**
   * A tag to look up in the current dictionary and perform template substitution on.
   */
  tag?: string;
  /**
   * Text to translate. Can also refer to a dictionary tag if it's a single element array:
   * `["tag"]`. The resolved text is processed with template substitution.
   */
  text?: TextPropType;
  /**
   * Text to translate without any further template substitution. Use for e.g. literal
   * translated text from an API.
   */
  content?: TextPropType;
  /**
   * The number of the thing being described for cases where the translation provides
   * pluralisation rules. Defaults to 1.
   */
  count?: number;
  /**
   * The element to render as. May be a string (e.g. `"div", "section"`) or a React component.
   */
  as?: AsType;
  /**
   * The remaining properties are passed to the rendered element.
   */
  [key: string]: any;
}

export interface TemplatePlaceholder {
  index: number;
  name?: string;
  text?: string;
}

export type TemplateToken = string | TemplatePlaceholder;

export type LocaleStack = readonly string[];
