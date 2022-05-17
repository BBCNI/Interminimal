"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcceptLanguage = void 0;
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
        return [0, locale];
    }
    return [1, term];
};
var cmp = function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
};
var parseAcceptLanguage = function (accept) {
    return (0, resolveLocale_1.canonicaliseLocales)(accept
        .split(/\s*,\s*/)
        .map(parsePriority)
        .filter(function (t) { return t[0] > 0; })
        .sort(function (a, b) { return cmp(b[0], a[0]) || cmp(a[1], b[1]); })
        .map(function (t) { return t[1]; }));
};
exports.parseAcceptLanguage = parseAcceptLanguage;
