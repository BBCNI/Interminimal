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
import difference from "lodash/difference";
var diffs = function (a, b) { return [
    difference(a, b),
    difference(b, a)
]; };
var TString = /** @class */ (function () {
    function TString(dict, lang) {
        if (lang && !(lang in dict))
            throw new Error("".concat(lang, " not in dictionary"));
        this.dict = dict;
        this.lang = lang;
    }
    TString.cast = function (obj, lang) {
        if (obj instanceof this) {
            if (lang)
                return obj.toLang([lang]);
            return obj;
        }
        return new this(obj, lang);
    };
    TString.literal = function (str, lang) {
        var _a;
        return new this((_a = {}, _a[lang] = str, _a), lang);
    };
    Object.defineProperty(TString.prototype, "language", {
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
        get: function () {
            return this.dict;
        },
        enumerable: false,
        configurable: true
    });
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
            var _a = diffs(pluralCategories, Object.keys(ttx)), missing = _a[0], extra = _a[1];
            if (missing.length)
                throw new Error("Missing plural categories: ".concat(missing.join(", ")));
            if (extra.length)
                throw new Error("Unknown plural categories: ".concat(extra.join(", ")));
        }
        var plur = pl.select(count !== null && count !== void 0 ? count : 1);
        // istanbul ignore next - we can only have a missing plural in prod.
        return ttx[plur] || "";
    };
    TString.prototype.toLang = function (langs) {
        if (!Array.isArray(langs))
            return this.toLang([langs]);
        var _a = this, lang = _a.lang, dict = _a.dict;
        for (var _i = 0, langs_1 = langs; _i < langs_1.length; _i++) {
            var l = langs_1[_i];
            if (!l)
                continue;
            if (l === lang)
                return this;
            if (l in dict)
                return new TString(dict, l);
        }
        // Wildcard language matches anything. Used for e.g. proper nouns that
        // are the same in any language.
        if ("*" in dict) {
            var ts = __assign({}, dict);
            ts[langs[0]] = dict["*"];
            return new TString(ts, langs[0]);
        }
        if (lang)
            return this;
        var fallback = Object.keys(dict)[0];
        if (!fallback)
            throw new Error("No translations available");
        return new TString(dict, fallback);
    };
    return TString;
}());
export { TString };
