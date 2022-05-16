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
exports.canonicaliseLocales = exports.localeRoot = exports.LocaleStack = void 0;
var canon = new WeakSet();
/**
 * Map incremental locale preferences to canonical locale stack arrays.
 * This allows us to rely on reference identity between equivalent locale
 * paths.
 *
 * For example:
 *
 * ```typescript
 * const ls1 = localeRoot.resolve(["en-GB", "en"]);
 * const ls2 = ls1.resolve(["cy"]); // ls2 is ["cy", "en-GB", "en"]
 * const ls3 = ls2.resolve(["en"]); // ls3 is ["en", "cy", "en-GB"]
 * const ls4 = localeRoot.resolve(["en", "cy", "en-GB"]) // ls4 is ["en", "cy", "en-GB"]
 * expect(ls4).toBe(ls3); // same thing!
 * ```
 *
 * Reference identity means we can index into cache Maps based on locale stacks
 * and trust that any given sequence of locales, however arrived at, will resolve
 * to the same LocaleStack.
 * @category Classes
 */
var LocaleStack = /** @class */ (function () {
    /**
     * Normally only called directly to create a new root node. Other
     * nodes are created by calling `resolve` on existing nodes. In
     * fact you probably don't want to call it at all - use [[`localeRoot`]]
     * instead.
     *
     * @param stack the stack for this node
     * @param parent the parent for this node
     */
    function LocaleStack(stack, parent) {
        if (stack === void 0) { stack = []; }
        /** @ignore */
        this.next = {};
        if (stack.length && !parent)
            throw new Error("Root LocaleStack can't have a stack");
        this.stack = Object.freeze(stack);
        canon.add(this.stack);
        this.parent = parent;
    }
    // Return a node whose stack has lang moved to its head, removing
    // a prior instance of lang. Fails if there's no prior instance of
    // lang in the stack.
    /** @ignore */
    LocaleStack.prototype.splice = function (lang, path) {
        // istanbul ignore next - guarded by condition in constructor
        if (!this.parent)
            throw new Error("No parent. Shouldn't happen.");
        // We've found the previous instance of lang in the stack so
        // splice the accumulated path onto our parent (i.e. just above
        // the previous instance of lang)
        if (lang === this.stack[0])
            return this.parent.resolve(__spreadArray([lang], path, true));
        // Ask our parent to do the splice with our primary language
        // appended to the path. Thus when lang is found the ancestor
        // that finds it can reconstitute the path from above lang
        return this.parent.splice(lang, path.concat(this.stack[0]));
    };
    /**
     * Return the node that is the result of prepending a
     * (possibly empty) list of locales to this node.
     *
     * ```typescript
     * const ls1 = localeRoot.resolve(["en", "fr"]);
     * const ls2 = ls1.resolve(["fr"]); // now ["fr", "en"]
     * const ls3 = localeRoot.resolve(["fr", "en"]); // also ["fr", "en"]
     * if (ls2 === ls3) console.log("Same thing!");
     * ```
     *
     * @param langs a list of langs to prepend to the stack
     * @returns a stack node with the prepended langs
     */
    LocaleStack.prototype.resolve = function (langs) {
        if (!langs.length)
            return this; // we've arrived
        var tail = __spreadArray([], langs, true);
        var lang = tail.pop();
        var nextNode = (this.next[lang] =
            this.next[lang] ||
                (this.stack.includes(lang)
                    ? this.splice(lang, [])
                    : new LocaleStack([lang].concat(this.stack), this)));
        return nextNode.resolve(tail);
    };
    return LocaleStack;
}());
exports.LocaleStack = LocaleStack;
/**
 * A global root node for the locale normalisation stack. Use this in preference
 * to calling `new LocaleStack()`.
 *
 * @category Locale
 */
exports.localeRoot = new LocaleStack();
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
 * @param langs the list of languages to canonicalise
 * @returns the canonical language stack
 * @category Locale
 */
var canonicaliseLocales = function (langs) {
    return canon.has(langs) ? langs : exports.localeRoot.resolve(langs).stack;
};
exports.canonicaliseLocales = canonicaliseLocales;
