var escapePercent = function (text) { return text.replace(/([%\[\]])/g, "%$1"); };
var stringifyNode = function (pl) {
    return typeof pl === "string"
        ? escapePercent(pl)
        : "%".concat(pl.index) + ("text" in pl ? "[".concat(pl.text, "]") : "");
};
export var stringifyTemplate = function (ast) {
    return ast.map(stringifyNode).join("");
};
// TODO: implement this as a raw parse - which returns recursive ASTs all the way down.
// When asked for a particular level of that AST, stringify any children. Cache both ASTs
// and partial strings (maybe?). Think that eliminates the N^depth behaviour of the this
// implementation. But do remember that N^depth where depth > 1 will be rare.
var parse = function (format) {
    // Use a capturing split to tokenise. We filter out empty tokens here so
    // that we don't trip over e.g. ["%1", "", "["] in the main loop. We want
    // to have ["%1", "["] instead.
    var tokens = format.split(/(%\d+|%.|\[|\])/).filter(function (t) { return t.length; });
    // Parse the next tokens
    var parsePart = function (stopAt) {
        var out = [];
        var put = function (frag) {
            if (out.length && typeof out[out.length - 1] === "string")
                out[out.length - 1] += frag;
            else
                out.push(frag);
        };
        while (true) {
            var tok = tokens.shift();
            if (stopAt) {
                if (process.env.NODE_ENV !== "production")
                    if (!tok)
                        throw new Error("Missing ".concat(stopAt));
                if (tok === stopAt)
                    break;
            }
            if (!tok)
                break;
            var m = tok.match(/^%(\d+|.)$/);
            if (m) {
                var arg = m[1];
                // Not a number so % escape?
                if (!/^\d+$/.test(arg)) {
                    put(arg);
                    continue;
                }
                var pl = { index: Number(arg) };
                // Following literal?
                if (tokens.length && tokens[0] === "[") {
                    tokens.shift();
                    pl.name = tok;
                    // Because this is a recursive syntax that we want to flatten
                    // to a single level, we handle subexpressions by parsing
                    // and re-stringifying them.
                    pl.text = stringifyTemplate(parsePart("]"));
                }
                out.push(pl);
                continue;
            }
            // Just stash the token
            put(tok);
        }
        return out;
    };
    return parsePart();
};
var cache = {};
export var parseTemplate = function (format) {
    return /%/.test(format)
        ? (cache[format] = cache[format] || parse(format))
        : [format];
};
