var parse = function (format) {
    // Use a capturing split to tokenise. We filter out empty tokens here so
    // that we don't trip over e.g. ["%1", "", "["] in the main loop. We want
    // to have ["%1", "["] instead.
    var tokens = format.split(/(%%|%\[|%]|%\d+|\[|])/).filter(function (t) { return t.length; });
    // Parse "[...]""
    var literal = function () {
        tokens.shift(); // "["
        var out = [];
        var level = 0;
        while (tokens.length) {
            var tok = tokens.shift();
            if (tok === "]") {
                if (level === 0)
                    return out.join("");
                level--;
            }
            else if (tok === "[") {
                level++;
            }
            out.push(tok);
        }
        throw new Error("Missing ] in template");
    };
    var out = [];
    // Append to output, merging adjacent strings
    var put = function (frag) {
        if (out.length && typeof out[out.length - 1] === "string")
            out[out.length - 1] += frag;
        else
            out.push(frag);
    };
    while (true) {
        var tok = tokens.shift();
        if (tok === undefined)
            break;
        var m = tok.match(/^%(\d+|[%\[\]])$/);
        if (m) {
            // % escape?
            if (Number.isNaN(m[1])) {
                put(m[1]);
                continue;
            }
            var pl = { index: Number(m[1]) };
            // Following literal?
            if (tokens.length && tokens[0] === "[") {
                pl.name = tok;
                pl.text = literal();
            }
            out.push(pl);
            continue;
        }
        put(tok);
    }
    return out;
};
var cache = {};
export var parseTemplate = function (format) {
    return /%/.test(format)
        ? (cache[format] = cache[format] || parse(format))
        : [format];
};
