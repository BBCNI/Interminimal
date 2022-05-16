"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bestLocale = void 0;
var lc = function (str) { return str.toLowerCase(); };
var lookup = function (tags, lang) {
    if (tags.has(lc(lang)))
        return lang;
    // any extensions?
    var idx = lang.lastIndexOf("-");
    if (idx < 0)
        return;
    // foo-x-bar?
    if (idx > 2 && lang.charAt(idx - 2) === "-")
        return lookup(tags, lang.slice(0, idx - 2));
    // foo-BAR
    return lookup(tags, lang.slice(0, idx));
};
var bestLocale = function (tags, langs) {
    var ts = new Set(tags.map(lc));
    for (var _i = 0, langs_1 = langs; _i < langs_1.length; _i++) {
        var lang = langs_1[_i];
        var m = lookup(ts, lang);
        if (m)
            return m;
    }
};
exports.bestLocale = bestLocale;
