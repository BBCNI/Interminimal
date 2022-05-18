"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcceptLanguage = void 0;
var bcp47_1 = require("./bcp47");
var resolveLocale_1 = require("./resolveLocale");
var parsePriority = function (term) {
    var mt = term.match(/(\S*?)\s*;\s*(.*)/);
    if (mt) {
        var locale = mt[1], args = mt[2];
        var ma = args.match(/^q=(\d+(?:\.\d+)?)$/i);
        if (ma) {
            var q = Number(ma[1]);
            if (q >= 0 && q <= 1)
                return [q, locale];
        }
        return [-1, ""];
    }
    return [1, term];
};
var cmp = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
};
var canonTag = function (tag) {
    // We're dealing with user input so use the uncached method.
    // If we used the cached version we'd be vulnerable to
    // cache stuffing attacks.
    var canon = (0, bcp47_1.canonicaliseLanguageUncached)(tag);
    return canon ? [canon] : [];
};
/**
 * Parse an HTTP Accept-Language header. Badly formed languages are
 * dropped, languages are canonicalised.
 *
 * ```typescript
 * const stack = parseAcceptLanguage("fr;b=9,en-GB;q=0.9,en-AU;q=0.8");
 * console.log(stack); // [ "en-GB", "en-AU" ]
 * ```
 *
 * @param accept the contents of the header
 * @returns a priority ordered language stack
 * @category Locale
 */
var parseAcceptLanguage = function (accept) {
    return (0, resolveLocale_1.canonicaliseLocales)(accept
        .split(/\s*,\s*/)
        .map(parsePriority)
        .filter(function (t) { return t[0] >= 0; })
        .sort(function (a, b) { return cmp(b[0], a[0]) || cmp(a[1], b[1]); })
        .map(function (t) { return t[1]; })
        .flatMap(canonTag));
};
exports.parseAcceptLanguage = parseAcceptLanguage;
