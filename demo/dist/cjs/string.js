"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TString = void 0;
var difference_1 = __importDefault(require("lodash/difference"));
var bcp47_1 = require("./bcp47");
var diffs = function (a, b) { return [
    (0, difference_1.default)(a, b),
    (0, difference_1.default)(b, a)
]; };
var isNonCanonical = function (lang) {
    if (lang === "*")
        return false;
    var canon = (0, bcp47_1.canonicaliseLanguage)(lang);
    return canon !== lang;
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
 * @category TString
 */
var TString = /** @class */ (function () {
    /** @ignore */
    function TString(dict, lang) {
        this.dict = dict;
        this.lang = lang;
    }
    /**
     * Cast a TString or TFatString to a TString. This and [[`literal`]] are the
     * main ways of creating new a `TString`.
     *
     * @param obj either a fat string or an existing TString
     * @param lang an optional language
     * @returns a TString which may be `obj` if `obj` is already a TString
     */
    TString.cast = function (obj, lang) {
        if (obj instanceof TString) {
            if (lang)
                return obj.toLang([lang]);
            return obj;
        }
        if (process.env.NODE_ENV !== "production") {
            var bad = Object.keys(obj).filter(isNonCanonical);
            if (bad.length)
                throw new Error("Non-canonical BCP 47 language tags: ".concat(bad.join(", ")));
        }
        var ts = new this(obj);
        if (lang)
            return ts.toLang([lang]);
        return ts;
    };
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
    TString.literal = function (str, lang) {
        var _a;
        return this.cast((_a = {}, _a[lang] = str, _a), lang);
    };
    Object.defineProperty(TString.prototype, "language", {
        /**
         * Get the current language of this TString. Throws an error if this
         * is a floating TString with no language selected.
         */
        get: function () {
            var lang = this.lang;
            if (!lang)
                throw new Error("This TString must have a language");
            return lang;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TString.prototype, "dictionary", {
        /**
         * Get the dictionary of this TString.
         */
        get: function () {
            return this.dict;
        },
        enumerable: false,
        configurable: true
    });
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
    TString.prototype.toString = function (count) {
        var language = this.language;
        var ttx = this.dict[language];
        if (typeof ttx === "string")
            return ttx;
        var pl = new Intl.PluralRules(language);
        if (process.env.NODE_ENV !== "production") {
            // Check that our fat string has all the required
            // plural categories.
            var pluralCategories = pl.resolvedOptions().pluralCategories;
            var _a = __read(diffs(pluralCategories, Object.keys(ttx)), 2), missing = _a[0], extra = _a[1];
            if (missing.length)
                throw new Error("Missing plural categories: ".concat(missing.join(", ")));
            if (extra.length)
                throw new Error("Unknown plural categories: ".concat(extra.join(", ")));
        }
        var plur = pl.select(count !== null && count !== void 0 ? count : 1);
        // istanbul ignore next - we can only have a missing plural in prod.
        return ttx[plur] || "";
    };
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
    TString.prototype.toLang = function (langs) {
        var _a;
        var _b = this, lang = _b.lang, dict = _b.dict;
        var first = langs[0];
        // fast cases
        if (first === lang)
            return this;
        if (first in dict)
            return new TString(dict, first);
        var tags = Object.keys(dict);
        if (tags.length > 1) {
            var best = (0, bcp47_1.bestLocale)(tags, langs);
            if (best)
                return best === lang ? this : new TString(dict, best);
        }
        // If there's a wildcard pretend that's what we were looking for.
        if ("*" in dict)
            return new TString(__assign(__assign({}, dict), (_a = {}, _a[first] = dict["*"], _a)), first);
        // If we already have a language assume that's good enough.
        if (lang)
            return this;
        // Do we have _any_ languages?
        if (tags.length)
            return new TString(dict, tags[0]);
        // Nope.
        throw new Error("No translations available");
    };
    return TString;
}());
exports.TString = TString;
