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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangContext = void 0;
var uniq_1 = __importDefault(require("lodash/uniq"));
var castArray_1 = __importDefault(require("lodash/castArray"));
var string_1 = require("./string");
var defaultMagicProps = function (k) {
    var m = k.match(/^t-(.+)$/);
    if (m)
        return m[1];
};
var LangContext = /** @class */ (function () {
    function LangContext(props) {
        if (props === void 0) { props = {}; }
        this.defaultLang = "en";
        this.magicProps = defaultMagicProps;
        this.lang = [];
        this.stackCache = null;
        this.tagCache = {};
        var lang = props.lang, dictionary = props.dictionary, rest = __rest(props, ["lang", "dictionary"]);
        if (dictionary && !("$$dict" in dictionary))
            throw new Error("Invalid dictionary (missing $$dict key)");
        // Upgrade lang to array if necessary.
        var langs = (0, castArray_1.default)(lang).filter(Boolean);
        Object.assign(this, __assign({ lang: langs, dictionary: dictionary }, rest));
    }
    Object.defineProperty(LangContext.prototype, "stack", {
        get: function () {
            var _this = this;
            var seal = function (o) { return Object.freeze((0, uniq_1.default)(o)); };
            var s = function () {
                var _a = _this, parent = _a.parent, lang = _a.lang, defaultLang = _a.defaultLang;
                if (parent) {
                    // Optimisation: if we don't add any languages our stack
                    // is the same as our parent's.
                    if (lang.length === 0)
                        return parent.stack;
                    return seal(lang.concat(parent.stack));
                }
                return seal(lang.concat(defaultLang));
            };
            return (this.stackCache = this.stackCache || s());
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
        if (props === void 0) { props = {}; }
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
        var _a = this, dictionary = _a.dictionary, stackCache = _a.stackCache, tagCache = _a.tagCache, lang = _a.lang, rest = __rest(_a, ["dictionary", "stackCache", "tagCache", "lang"]);
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
    LangContext.prototype.resolveMagicProps = function (props, lang) {
        var _this = this;
        var _a = this, magicProps = _a.magicProps, stack = _a.stack;
        var search = lang ? __spreadArray([lang], stack, true) : stack;
        var pairs = Object.entries(props).map(function (_a) {
            var k = _a[0], v = _a[1];
            var nk = magicProps(k, v);
            if (nk)
                return [nk, _this.render(_this.resolve(v).toLang(search))];
            return [k, v];
        });
        return Object.fromEntries(pairs);
    };
    LangContext.prototype.render = function (ts, count) {
        var _this = this;
        return ts
            .toString(count)
            .split(/(%%|%\{.+?\})/)
            .map(function (tok) {
            return (function (match) {
                return match
                    ? _this.resolveTag(match[1])
                        .toLang(__spreadArray([ts.language], _this.stack, true))
                        .toString(count)
                    : tok;
            })(tok.match(/^%\{(.+)\}$/));
        })
            .join("");
    };
    return LangContext;
}());
exports.LangContext = LangContext;
