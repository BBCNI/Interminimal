import { canonicaliseLocales } from "./localeStack";
var lc = function (str) { return str.toLowerCase(); };
var cache = new WeakMap();
var expandLang = function (lang) {
    var idx = lang.lastIndexOf("-");
    if (idx < 0)
        return [lang];
    // foo-x-bar?
    if (idx > 2 && lang.charAt(idx - 2) === "-")
        return [lang].concat(expandLang(lang.slice(0, idx - 2)));
    // foo-BAR
    return [lang].concat(expandLang(lang.slice(0, idx)));
};
var expand = function (langs) {
    var exp = cache.get(langs);
    if (exp)
        return exp;
    var nexp = canonicaliseLocales(langs.flatMap(expandLang)).stack;
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
 * @param tags an array of available language tags
 * @param langs an array of locales to match
 * @returns a language tag or `undefined` if no match found
 */
export var bestLocale = function (tags, langs) {
    var ts = new Set(tags.map(lc));
    return expand(langs).find(function (ln) { return ts.has(lc(ln)); });
};
