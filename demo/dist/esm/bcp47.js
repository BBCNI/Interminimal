import { canonicaliseLocales } from "./localeStack";
var lc = function (str) { return str.toLowerCase(); };
var langCache = {};
var expandLang = function (lang) {
    var xl = function () {
        var idx = lang.lastIndexOf("-");
        if (idx < 0)
            return [lang];
        // foo-x-bar?
        if (idx > 2 && lang.charAt(idx - 2) === "-")
            return [lang].concat(expandLang(lang.slice(0, idx - 2)));
        // foo-BAR
        return [lang].concat(expandLang(lang.slice(0, idx)));
    };
    return (langCache[lang] = langCache[lang] || xl());
};
var cache = new WeakMap();
// Cached expansion of locales:
//  ["en-GB", "fr-CA"] -> ["en-GB", "en", "fr-CA", "fr"]
var expand = function (langs) {
    var exp = cache.get(langs);
    if (exp)
        return exp;
    var nexp = canonicaliseLocales(langs.flatMap(expandLang));
    cache.set(langs, nexp);
    return nexp;
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
