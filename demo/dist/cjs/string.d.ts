import { TFatString } from "./types";
export declare class TString {
    private readonly dict;
    private readonly lang;
    constructor(dict: TFatString, lang?: string);
    static cast(obj: TFatString | TString, lang?: string): TString;
    static literal(str: string, lang: string): TString;
    get language(): string;
    get dictionary(): TFatString;
    toString(count?: number): string;
    toLang(langs: readonly string[]): TString;
}
