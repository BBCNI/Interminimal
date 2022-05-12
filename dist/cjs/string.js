"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TString = void 0;
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
        console.log({ pl: pl });
        if (process.env.NODE_ENV !== "production") {
            // Check that our fat string supports all the
            // plural categories
            var pluralCategories = pl.resolvedOptions().pluralCategories;
            console.log(pluralCategories);
        }
        var plur = pl.select(count !== null && count !== void 0 ? count : 1);
        var result = ttx[plur];
        if (typeof result === "string")
            return result;
        throw new Error("Can't map plural ".concat(plur, " for ").concat(count !== null && count !== void 0 ? count : 1));
    };
    TString.prototype.toLang = function (langs) {
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
        var fallback = Object.keys(this.dict)[0];
        if (!fallback)
            throw new Error("No translations available");
        return new TString(this.dict, fallback);
    };
    return TString;
}());
exports.TString = TString;
