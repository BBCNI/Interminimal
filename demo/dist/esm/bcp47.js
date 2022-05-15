var lc = function (str) { return str.toLowerCase(); };
var cmp = function (a, b) { return (a < b ? -1 : a > b ? 1 : 0); };
// Order BCP47 tags so that more specific ones come first
var cmpTag = function (a, b) {
    var ap = a.split(/-/);
    var bp = b.split(/-/);
    while (ap.length && bp.length) {
        var c = cmp(ap.shift(), bp.shift());
        if (c)
            return c;
    }
    return ap.length ? -1 : 1;
};
var pred = function (tag, lang) {
    if (tag === lang)
        return true;
    var idx = lang.lastIndexOf("-");
    if (idx < 0)
        return false;
    if (lang.charAt(idx - 2) === "-")
        return pred(tag, lang.slice(0, idx - 2));
    return pred(tag, lang.slice(0, idx));
};
export function bestLocale(tags, langs) {
    var canon = tags.slice(0).sort(cmpTag);
    for (var _i = 0, _a = langs.map(lc); _i < _a.length; _i++) {
        var lang = _a[_i];
        for (var _b = 0, canon_1 = canon; _b < canon_1.length; _b++) {
            var tag = canon_1[_b];
            if (pred(lc(tag), lang))
                return tag;
        }
    }
}
