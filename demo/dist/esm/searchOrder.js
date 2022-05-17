var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { canonicaliseLocales } from "./resolveLocale";
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
    var lang = path[0], tail = path.slice(1);
    if (tail.length)
        return { lang: lang, children: [makeNode(tail)] };
    return { lang: lang, children: [] };
};
var mergeNodes = function (a, b) { return ({
    lang: a.lang,
    children: groupTree(__spreadArray(__spreadArray([], a.children, true), b.children, true))
}); };
// Group shared prefixes.
var groupTree = function (tree) {
    if (tree.length < 2)
        return tree;
    var head = tree[0], next = tree[1], tail = tree.slice(2);
    if (head.lang === next.lang)
        return groupTree(__spreadArray([mergeNodes(head, next)], tail, true));
    return __spreadArray([head], groupTree(__spreadArray([next], tail, true)), true);
};
// Render node in depth first postfix order so more specific
// tags come first
var renderNode = function (node) { return __spreadArray(__spreadArray([], renderTree(node.children), true), [
    node.lang
], false); };
var renderTree = function (tree) {
    return tree.flatMap(renderNode);
};
export var searchOrder = function (langs) {
    return canonicaliseLocales(renderTree(groupTree(langs.map(expandLang).map(makeNode))));
};
