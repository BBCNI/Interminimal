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
import { safeCanonicaliseLanguage } from "./bcp47";
import { canonicaliseLocales } from "./resolveLocale";
var parsePriority = function (term) {
    var mt = term.match(/(\S*?)\s*;\s*(.*)/);
    if (mt) {
        var _a = __read(mt, 3), locale = _a[1], args = _a[2];
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
    var canon = safeCanonicaliseLanguage(tag);
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
export var parseAcceptLanguage = function (accept) {
    return canonicaliseLocales(accept
        .split(/\s*,\s*/)
        .map(parsePriority)
        .filter(function (t) { return t[0] >= 0; })
        .sort(function (a, b) { return cmp(b[0], a[0]); })
        .map(function (t) { return t[1]; })
        .flatMap(canonTag));
};
