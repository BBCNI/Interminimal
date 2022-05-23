import { LocaleStack } from "./resolveLocale";
export declare type TPluralType = {
    readonly [key in Intl.LDMLPluralRule]?: string;
};
export declare type TFatString = {
    readonly [key: string]: string | TPluralType;
} & {
    $$dict?: never;
} & {
    $$meta?: object;
};
/**
 * Wrap a fat string with methods to coerce it to a specific
 * language and stringify it. TStrings are immutable; all
 * methods that appear to modify a TString return a new one.
 *
 * To create a new `TString` call [[`cast`]] or
 * [[`literal`]].
 *
 * ```typescript
 * import { TString } from "interminimal";
 *
 * const catsDict = {
 *   en: { one: "cat", other: "cats" },
 *   de: { one: "Katze", other: "Katzen" },
 *   cy: {
 *     zero: "cathod",
 *     one: "gath",
 *     two: "gath",
 *     few: "cath",
 *     many: "chath",
 *     other: "cath"
 *   }
 * };
 *
 * const counts = [0, 1, 1.5, 2, 3, 6, 42];
 *
 * // Count the cats in Welsh
 * const cat = TString.cast(catsDict);
 * const welshCat = cat.toLang(["cy", "en"]);
 * for (const count of counts) {
 *   console.log(`${count} ${welshCat.toString(count)}`);
 * }
 * // 0 cathod
 * // 1 gath
 * // 1.5 cath
 * // 2 gath
 * // 3 cath
 * // 6 chath
 * // 42 cath
 * ```
 * @category Classes
 */
export declare class TString {
    /** @ignore */
    private readonly dict;
    /** @ignore */
    private readonly lang;
    /** @ignore */
    private constructor();
    /**
     * Cast a TString or TFatString to a TString. This and [[`literal`]] are the
     * main ways of creating new a `TString`.
     *
     * @param obj either a fat string or an existing TString
     * @param lang an optional language
     * @returns a TString which may be `obj` if `obj` is already a TString
     */
    static cast(obj: TFatString | TString, lang?: string): TString;
    /**
     * Cast a string literal and language into a single-language TString.
     * This and [[`cast`]] are the main ways of creating new a `TString`.
     *
     * ```typescript
     * const ts = TString.literal("Hello", "en");
     * // Try to convert to "de", won't work - we'll get "en" instead
     * console.log(ts.toLang["de"].language); // "en"
     * ```
     *
     * @param str a regular string
     * @param lang the language of the string
     * @returns a new TString
     */
    static literal(str: string, lang: string): TString;
    /**
     * Get the current language of this TString. Throws an error if this
     * is a floating TString with no language selected.
     */
    get language(): string;
    /**
     * Get the dictionary of this TString.
     */
    get dictionary(): TFatString;
    /**
     * Render this TString as a string. When the TString contains plural
     * forms an appropriate plural will be chosen based on `count`. The
     * correct plural form is chosen using `Intl.PluralRules`.
     *
     * ```typescript
     * // Plurals
     * const ts = new TString({
     *   en: { one: "cat", other: "cats" },
     *   de: { one: "Katze", other: "Katzen" }
     * });
     * console.log(ts.toLang(["de"]).toString(10)); // "Katzen"
     * ```
     *
     * @param count an optional count to select a plural form
     */
    toString(count?: number): string;
    /**
     * Attempt to translate this TString into one of a list of languages.
     *
     * ```typescript
     * const ts = new TString({
     *   en: "color",
     *   de: "Farbe"
     * });
     * // We'd like British English or French but we'll get "en"
     * // (U.S. English) which is the best match for "en-GB"
     * console.log(ts.toLang(["en-GB", "fr"]), toString()); // "color"
     * ```
     *
     * Use the [Language Stack Calculator](/Interminimal/demo/calculator) to
     * experiment with the search path that is used to find the best language
     * match.
     *
     * @param langs an array of BCP47 language codes in descending preference order
     * @returns a new TString with its `language` set to the best match
     */
    toLang(langs: LocaleStack): TString;
}
