"use strict";
// Map incremental locale preferences to canonical locale stack arrays.
// This allows us to rely on reference identity between equivalent locale
// paths.
//
// For example:
//
// const root = new LocaleStack(); // root must be empty
// const ls1 = root.resolve(["en-GB", "en"]);
// const ls2 = ls1.resolve(["cy"]); // ls2 is ["cy", "en-GB", "en"]
// const ls3 = ls2.resolve(["en"]); // ls3 is ["en", "cy", "en-GB"]
// const ls4 = root.resolve(["en", "cy", "en-GB"]) // ls4 is ["en", "cy", "en-GB"]
// expect(ls4).toBe(ls3); // same thing!
//
// Reference identity means we can index into cache Maps based on locale stacks
// and trust that any given sequence of locales, however arrived at, will resolve
// to the same LocaleStack.
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
exports.LocaleStack = void 0;
var LocaleStack = /** @class */ (function () {
    function LocaleStack(stack, parent) {
        if (stack === void 0) { stack = []; }
        this.next = {};
        if (stack.length && !parent)
            throw new Error("Root LocaleStack can't have a stack");
        this.stack = Object.freeze(stack);
        this.parent = parent;
    }
    LocaleStack.prototype.splice = function (lang, path) {
        // istanbul ignore next - guarded by condition in constructor
        if (!this.parent)
            throw new Error("No parent. Shouldn't happen.");
        if (lang === this.stack[0])
            return this.parent.resolve(__spreadArray([lang], path, true));
        return this.parent.splice(lang, path.concat(this.stack[0]));
    };
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