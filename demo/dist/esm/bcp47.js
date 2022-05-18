import { canonicaliseLocales } from "./resolveLocale";
import { searchOrder } from "./searchOrder";
var lc = function (str) { return str.toLowerCase(); };
var expCache = new WeakMap();
// Cached expansion of locales:
//  ["en-GB", "fr-CA"] -> ["en-GB", "en", "fr-CA", "fr"]
var expand = function (langs) {
    var tryExp = expCache.get(langs);
    if (tryExp)
        return tryExp;
    var newExp = searchOrder(langs);
    expCache.set(langs, newExp);
    return newExp;
};
/**
 * Given a set of BCP 47 language tags and a list of locales in
 * descending preference order find the tag that best satisfies
 * the locale preference.
 *
 * ```typescript
 * import { bestLocale } from "interminimal";
 * const tags = ["en", "en-GB", "fr", "fr-BE"];
 * console.log(bestLocale(tags, ["en-GB"])); // en-GB
 * console.log(bestLocale(tags, ["en-AU", "fr-BE"])); // en
 * console.log(bestLocale(tags, ["de", "fr-BE", "en"])); // fr-BE
 * console.log(bestLocale(tags, ["cy", "fr-BE-x-foo", "en"])); // fr-BE
 * console.log(bestLocale(tags, ["de", "de-AT"])); // undefined
 * ```
 *
 * @param tags an array of available language tags - order unimportant
 * @param langs an array of locales to match
 * @returns a language tag or `undefined` if no match found
 * @category Locale
 */
export var bestLocale = function (tags, langs) {
    var ts = new Set(tags.map(lc));
    return expand(canonicaliseLocales(langs)).find(function (ln) { return ts.has(lc(ln)); });
};
var canonCache = new Map();
export var canonicaliseLanguageUncached = function (tag) {
    try {
        return new Intl.Locale(tag).toString();
    }
    catch (e) { }
};
/**
 * Canonicalise a language tag.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export var canonicaliseLanguage = function (tag) {
    if (canonCache.has(tag))
        return canonCache.get(tag);
    var canon = canonicaliseLanguageUncached(tag);
    canonCache.set(tag, canon);
    return canon;
};
