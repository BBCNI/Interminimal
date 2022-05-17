"use strict";
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
exports.canonicaliseLocales = exports.localeRoot = exports.resolveLocales = void 0;
require("./weakRef"); // Polyfill WeakRef for Opera
var parentCache = new WeakMap();
var nextCache = new WeakMap();
var nextSlot = function (stack) {
    var n = nextCache.get(stack);
    if (!n)
        nextCache.set(stack, (n = {}));
    return n;
};
var splice = function (stack, lang, path) {
    var parent = parentCache.get(stack);
    // istanbul ignore next - can't happen
    if (!parent)
        throw new Error("No parent!");
    if (lang === stack[0])
        return (0, exports.resolveLocales)(parent, __spreadArray([lang], path, true));
    return splice(parent, lang, path.concat(stack[0]));
};
var node = function (stack, parent) {
    parentCache.set(stack, parent);
    return Object.freeze(stack);
};
var resolveLocales = function (stack, langs) {
    if (!langs.length)
        return stack;
    var tail = __spreadArray([], langs, true);
    var lang = tail.pop();
    var slot = nextSlot(stack);
    var tryNext = slot[lang] && slot[lang].deref();
    // Cache hit
    if (tryNext)
        return (0, exports.resolveLocales)(tryNext, tail);
    // Cache miss
    var newNext = stack.includes(lang)
        ? splice(stack, lang, [])
        : node([lang].concat(stack), stack);
    slot[lang] = new WeakRef(newNext);
    return (0, exports.resolveLocales)(newNext, tail);
};
exports.resolveLocales = resolveLocales;
exports.localeRoot = node([]);
var canonicaliseLocales = function (stack) {
    return parentCache.has(stack) ? stack : (0, exports.resolveLocales)(exports.localeRoot, stack);
};
exports.canonicaliseLocales = canonicaliseLocales;
