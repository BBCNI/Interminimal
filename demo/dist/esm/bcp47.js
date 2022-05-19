import { searchOrder } from "./searchOrder";
import { canonicaliseLocales } from "./resolveLocale";
var lc = function (str) { return str.toLowerCase(); };
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
    return searchOrder(canonicaliseLocales(langs)).find(function (ln) { return ts.has(lc(ln)); });
};
var canonCache = new Map();
/**
 * Canonicalise a language tag. No caching - safe to use on user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export var safeCanonicaliseLanguage = function (tag) {
    try {
        // Or use Intl.getCanonicalLocales()? Doesn't make much different - the
        // same error can be thrown.
        return new Intl.Locale(tag).toString();
    }
    catch (e) { }
};
/**
 * Canonicalise a language tag. Canonicalisation is cached so don't
 * call this function on untrusted input. Use
 * [[`safeCanonicaliseLanguage`]] for user input.
 *
 * @param tag the language to canonicalise
 * @returns the canonical version or undefined if tag is invalid
 * @category Locale
 */
export var canonicaliseLanguage = function (tag) {
    if (canonCache.has(tag))
        return canonCache.get(tag);
    var canon = safeCanonicaliseLanguage(tag);
    canonCache.set(tag, canon);
    return canon;
};
