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
        var _a;
        if (!Array.isArray(langs))
            return this.toLang([langs]);
        for (var _i = 0, langs_1 = langs; _i < langs_1.length; _i++) {
            var lang = langs_1[_i];
            if (!lang)
                continue;
            if (lang === this.lang)
                return this;
            if (lang in this.dict)
                return new TString(this.dict, lang);
        }
        if (this.lang)
            return this;
        // Wildcard language matches anything. Used for e.g. brand names that
        // are the same in any language.
        if ("*" in this.dict) {
            var tx = this.dict["*"];
            return new TString((_a = {}, _a[langs[0]] = tx, _a["*"] = tx, _a), langs[0]);
        }
        var fallback = Object.keys(this.dict)[0];
        if (!fallback)
            throw new Error("No translations available");
        return new TString(this.dict, fallback);
    };
    return TString;
}());
export { TString };
