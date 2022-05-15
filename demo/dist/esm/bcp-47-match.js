function factory(check) {
    return function (tags, ranges) {
        var left = cast(tags, "tag");
        var right = cast(ranges === null || ranges === undefined ? "*" : ranges, "range");
        var rightIndex = -1;
        while (++rightIndex < right.length) {
            var range = right[rightIndex].toLowerCase();
            // Ignore wildcards
            if (range === "*")
                continue;
            var leftIndex = -1;
            /** @type {Tags} */
            var next = [];
            while (++leftIndex < left.length) {
                if (check(left[leftIndex].toLowerCase(), range)) {
                    // Exit if this is a lookup and we have a match.
                    return /** @type {IsFilter extends true ? Tags : Tag|undefined} */ left[leftIndex];
                }
                else {
                    next.push(left[leftIndex]);
                }
            }
            left = next;
        }
    };
}
/**
 * Lookup (Section 3.4) matches a language priority list consisting of basic
 * language ranges to sets of language tags to find the one exact language tag
 * that best matches the range.
 */
export var lookup = factory(function (tag, range) {
    var right = range;
    /* eslint-disable-next-line no-constant-condition */
    while (true) {
        if (right === "*" || tag === right)
            return true;
        var index = right.lastIndexOf("-");
        if (index < 0)
            return false;
        if (right.charAt(index - 2) === "-")
            index -= 2;
        right = right.slice(0, index);
    }
});
/**
 * Validate tags or ranges, and cast them to arrays.
 *
 * @param {string|Array<string>} values
 * @param {string} name
 * @returns {Array<string>}
 */
function cast(values, name) {
    var value = values && typeof values === "string" ? [values] : values;
    if (!value || typeof value !== "object" || !("length" in value)) {
        throw new Error("Invalid " + name + " `" + value + "`, expected non-empty string");
    }
    return value;
}
