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
var resolve = function (stack, langs) {
    if (!langs.length)
        return stack;
    var tail = __spreadArray([], langs, true);
    var lang = tail.pop();
    var slot = nextSlot(stack);
    var tryNext = slot[lang] && slot[lang].deref();
    // Cache hit
    if (tryNext)
        return resolve(tryNext, tail);
    // Cache miss
    var newNext = stack.includes(lang)
        ? splice(stack, lang, [])
        : node([lang].concat(stack), stack);
    slot[lang] = new WeakRef(newNext);
    return resolve(newNext, tail);
};
/**
 * Return the stack that is the result of prepending a
 * (possibly empty) list of locales to a locale stack
 *
 * ```typescript
 * const ls1 = resolveLocales(localeRoot, ["en", "fr"]);
 * const ls2 = resolveLocales(ls1, ["fr"]); // now ["fr", "en"]
 * const ls3 = resolveLocales(localeRoot, ["fr", "en"]); // also ["fr", "en"]
 * if (ls2 === ls3) console.log("Same thing!");
 * ```
 *
 * @param stack
 * @param langs a list of langs to prepend to the stack
 * @returns a stack node with the prepended langs
 * @category Locale
 */
var resolveLocales = function (stack, langs) { return resolve((0, exports.canonicaliseLocales)(stack), langs); };
exports.resolveLocales = resolveLocales;
/**
 * A global empty locale stack which equals [].
 *
 * @category Locale
 */
exports.localeRoot = node([]);
/**
 * Canonicalise a list of languages.
 *
 * ```typescript
 * console.log(
 *   canonicaliseLocales(["en", "fr", "en", "de", "de", "fr", "cy", "de"])
 * );
 * // ["en", "fr", "de", "cy"]
 * ```
 *
 * Equivalent language lists canonicalise to the same array object and can therefore
 * be used as the key for a `Map` or `Set`.
 *
 * @param stack the list of languages to canonicalise
 * @returns the canonical language stack
 * @category Locale
 */
var canonicaliseLocales = function (stack) {
    return parentCache.has(stack) ? stack : resolve(exports.localeRoot, stack);
};
exports.canonicaliseLocales = canonicaliseLocales;
