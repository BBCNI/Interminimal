import {
  ComponentClass,
  FunctionComponent,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import { LangContextProps } from "./context";
import { TFatString, TString } from "./string";

/**
 * The type of a component - either a string like `"div"` or `"span"` or a React component.
 */
export type AsType =
  | string
  | FunctionComponent<{ lang?: string; ref?: Ref<ReactElement> }>
  | ComponentClass<{ lang?: string; ref?: Ref<ReactElement> }, any>;

export type StringPropType = TFatString | TString | string;
export type TextPropType = TFatString | TString | string | string[];

export type TranslateLocalProps = LangContextProps & { children: ReactNode };

export type TranslateProps = LangContextProps & {
  children: ReactNode;
  as?: AsType;
};
