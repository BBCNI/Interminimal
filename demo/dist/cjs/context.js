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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangContext = void 0;
var castArray_1 = __importDefault(require("lodash/castArray"));
var string_1 = require("./string");
var localeStack_1 = require("./localeStack");
var localeRoot = new localeStack_1.LocaleStack();
var LangContext = /** @class */ (function () {
    function LangContext(props) {
        if (props === void 0) { props = {}; }
        this.defaultLang = "en";
        this.lang = [];
        this.locale = localeRoot;
        this.stackCache = null;
        this.tagCache = {};
        var lang = props.lang, dictionary = props.dictionary, rest = __rest(props, ["lang", "dictionary"]);
        if (dictionary && !("$$dict" in dictionary))
            throw new Error("Invalid dictionary (missing $$dict key)");
        // Upgrade lang to array if necessary.
        var langs = (0, castArray_1.default)(lang).filter(Boolean);
        Object.assign(this, __assign(__assign({}, rest), { lang: langs, dictionary: dictionary }));
        var ldContext = this.parent
            ? this.parent.locale
            : localeRoot.resolve([this.defaultLang]);
        this.locale = ldContext.resolve(langs);
        this.root = this.parent ? this.parent.root : this;
    }
    Object.defineProperty(LangContext.prototype, "stack", {
        get: function () {
            return this.locale.stack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "languages", {
        // Version of the stack for APIs that don't like readonly string[].
        // The array is still frozen so any attempts at modification will
        // fail.
        get: function () {
            return this.stack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "language", {
        get: function () {
            return this.stack[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "ambience", {
        get: function () {
            return this.ambient || this.language;
        },
        enumerable: false,
        configurable: true
    });
    LangContext.prototype.derive = function (props) {
        var _this = this;
        // Handle dictionaryFromTag
        var transformProps = function (_a) {
            var dictionaryFromTag = _a.dictionaryFromTag, rest = __rest(_a, ["dictionaryFromTag"]);
            if (dictionaryFromTag) {
                if (props.dictionary)
                    throw new Error("dictionary and dictionaryFromTag both found");
                return __assign({ dictionary: _this.resolveDictionary(dictionaryFromTag) }, rest);
            }
            return rest;
        };
        var _a = this, dictionary = _a.dictionary, stackCache = _a.stackCache, tagCache = _a.tagCache, lang = _a.lang, ls = _a.locale, rest = __rest(_a, ["dictionary", "stackCache", "tagCache", "lang", "locale"]);
        return new LangContext(__assign(__assign(__assign({}, rest), transformProps(props)), { parent: this }));
    };
    LangContext.prototype.translate = function (text) {
        return this.resolve(text).toLang(this.stack);
    };
    // Convenience method: given a TString (or [tag]) and a props object, translate the
    // string into the current language and update the props' lang attribute as
    // appropriate
    LangContext.prototype.translateTextAndProps = function (text, _a, count) {
        if (_a === void 0) { _a = {}; }
        var lang = _a.lang, props = __rest(_a, ["lang"]);
        var ts = this.translate(text);
        var str = this.render(ts, count);
        if (ts.language !== this.ambience)
            return { str: str, props: __assign(__assign({}, props), { lang: ts.language }) };
        return { str: str, props: props };
    };
    LangContext.prototype.castString = function (text) {
        if (typeof text === "string")
            return string_1.TString.literal(text, this.defaultLang);
        return string_1.TString.cast(text);
    };
    LangContext.prototype.resolve = function (text) {
        if (Array.isArray(text)) {
            if (text.length !== 1)
                throw new Error("A tag must be an array of length 1");
            return this.resolveTag(text[0]);
        }
        return this.castString(text);
    };
    LangContext.prototype.findTag = function (tag) {
        var _this = this;
        var tagCache = this.tagCache;
        var rt = function () {
            var _a = _this, parent = _a.parent, dictionary = _a.dictionary;
            if (dictionary) {
                var $$dict = dictionary.$$dict;
                if ($$dict && tag in $$dict)
                    return $$dict[tag];
            }
            if (parent)
                return parent.findTag(tag);
            throw new Error("No translation for ".concat(tag));
        };
        return (tagCache[tag] = tagCache[tag] || rt());
    };
    LangContext.prototype.resolveTag = function (tag) {
        var it = this.findTag(tag);
        if ("$$dict" in it)
            throw new Error("".concat(tag, " is a dictionary"));
        return this.castString(it);
    };
    LangContext.prototype.resolveDictionary = function (tag) {
        var it = this.findTag(tag);
        if ("$$dict" in it)
            return it;
        throw new Error("".concat(tag, " is not a dictionary"));
    };
    LangContext.prototype.resolveTranslationProps = function (tag, text) {
        var _this = this;
        var r = function () {
            if (process.env.NODE_ENV !== "production")
                if (tag && text)
                    throw new Error("Got both tag and text");
            if (text)
                return _this.resolve(text);
            if (tag)
                return _this.resolveTag(tag);
            throw new Error("No text or tag");
        };
        return r().toLang(this.stack);
    };
    LangContext.prototype.resolveLocales = function (langs) {
        return this.locale.resolve(langs).stack;
    };
    LangContext.prototype.canonicaliseLocales = function (langs) {
        return this.root.resolveLocales(langs);
    };
    LangContext.prototype.resolveMagicProps = function (props, lang) {
        var _this = this;
        var mapMagic = function (k) {
            var m = k.match(/^t-(.+)$/);
            if (m)
                return m[1];
        };
        var search = lang ? this.resolveLocales([lang]) : this.locale.stack;
        var pairs = Object.entries(props).map(function (_a) {
            var k = _a[0], v = _a[1];
            var nk = mapMagic(k);
            if (nk)
                return [nk, _this.render(_this.resolve(v).toLang(search))];
            return [k, v];
        });
        return Object.fromEntries(pairs);
    };
    LangContext.prototype.render = function (ts, count) {
        var _this = this;
        var stack = this.resolveLocales([ts.language]);
        return ts
            .toString(count)
            .split(/(%%|%\{[^%]+?\})/)
            .map(function (tok) {
            return (function (match) {
                return match
                    ? _this.resolveTag(match[1]).toLang(stack).toString(count)
                    : tok;
            })(tok.match(/^%\{(.+)\}$/));
        })
            .join("");
    };
    return LangContext;
}());
exports.LangContext = LangContext;
