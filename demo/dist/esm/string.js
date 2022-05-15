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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import difference from "lodash/difference";
import { shapeSlot } from "./shapeMap";
import { bestLocale } from "./bcp47";
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
        if (obj instanceof TString) {
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
    Object.defineProperty(TString.prototype, "slot", {
        get: function () {
            return shapeSlot(this.dict);
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
        var _this = this;
        var _b = this, lang = _b.lang, dict = _b.dict;
        // Fast cases - no need to consult cache
        var first = langs[0];
        if (first === lang)
            return this;
        if (first in dict)
            return new TString(dict, first);
        var resolveKey = function () {
            var tags = Object.keys(dict);
            // console.log(`langs: [${langs.join(", ")}], tags: [${tags.join(", ")}]`);
            if (tags.length > 1) {
                // Only do expensive lookup if we have no choice.
                var best = bestLocale(tags, __spreadArray([], langs, true));
                if (best)
                    return best;
            }
            if ("*" in dict)
                return "*";
            if (lang)
                return lang;
            return tags[0];
        };
        var lookupKey = function () {
            var slot = _this.slot;
            var key = slot.get(langs);
            if (!key)
                slot.set(langs, (key = resolveKey()));
            return key;
        };
        var key = lookupKey();
        if (!key)
            throw new Error("No translations available");
        if (key === lang)
            return this;
        if (key === "*")
            return new TString(__assign(__assign({}, dict), (_a = {}, _a[langs[0]] = dict["*"], _a)), langs[0]);
        return new TString(dict, key);
    };
    return TString;
}());
export { TString };
