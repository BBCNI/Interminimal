"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOrder = void 0;
var resolveLocale_1 = require("./resolveLocale");
var MaxLength = 35;
var expandLang = function (lang) {
    if (lang.length > MaxLength)
        throw new Error("BCP 47 language tag too long");
    var idx = lang.lastIndexOf("-");
    if (idx < 0)
        return [lang];
    if (idx > 2 && lang.charAt(idx - 2) === "-")
        return expandLang(lang.slice(0, idx - 2)).concat(lang);
    return expandLang(lang.slice(0, idx)).concat(lang);
};
var makeNode = function (path) {
    // istanbul ignore next - can't happen
    if (path.length === 0)
        throw new Error("Empty thing");
    var _a = __read(path), lang = _a[0], tail = _a.slice(1);
    if (tail.length)
        return { lang: lang, children: [makeNode(tail)] };
    return { lang: lang, children: [] };
};
var mergeNodes = function (a, b) { return ({
    lang: a.lang,
    children: groupTree(__spreadArray(__spreadArray([], __read(a.children), false), __read(b.children), false))
}); };
// Group shared prefixes.
var groupTree = function (tree) {
    if (tree.length < 2)
        return tree;
    var _a = __read(tree), head = _a[0], next = _a[1], tail = _a.slice(2);
    // The head.children.length check is subtle. It's the thing
    // that stops e.g. ["en", "en-US"] from turning into ["en-US", "en"]
    // while allowing ["en-US"] to turn into ["en-US", "en"].
    if (head.lang === next.lang && head.children.length)
        return groupTree(__spreadArray([mergeNodes(head, next)], __read(tail), false));
    return __spreadArray([head], __read(groupTree(__spreadArray([next], __read(tail), false))), false);
};
// Render node in depth first postfix order so more specific
// tags come first
var renderNode = function (node) { return __spreadArray(__spreadArray([], __read(renderTree(node.children)), false), [
    node.lang
], false); };
var renderTree = function (tree) {
    return tree.flatMap(renderNode);
};
var expandSearch = function (langs) {
    return (0, resolveLocale_1.canonicaliseLocales)(renderTree(groupTree(langs.map(expandLang).map(makeNode))));
};
var expCache = new WeakMap();
var cacheLookup = function (langs) {
    var tryExp = expCache.get(langs);
    if (tryExp)
        return tryExp;
    var newExp = expandSearch(langs);
    expCache.set(langs, newExp);
    return newExp;
};
// Cached expansion of locales:
//  ["en-GB", "fr-CA"] -> ["en-GB", "en", "fr-CA", "fr"]
var searchOrder = function (langs) {
    return cacheLookup((0, resolveLocale_1.canonicaliseLocales)(langs));
};
exports.searchOrder = searchOrder;
