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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { TString } from "./string";
import { NextCache } from "./nextCache";
/**
 * Dictionary type guard: checks that an object looks like a dictionary.
 * Specifically does it have a `$$dict` key?
 *
 * @param d maybe a dictionary
 * @returns true if `d` looks like a dictionary
 */
export var isDictionary = function (d) {
    return d && typeof d === "object" && "$$dict" in d;
};
/**
 * @category Dictionary
 */
export var checkDictionary = function (dictionary) {
    if (!isDictionary(dictionary))
        throw new Error("Invalid dictionary (missing $$dict key)");
    Object.values(dictionary.$$dict).map(function (ts) {
        return "$$dict" in ts ? checkDictionary(ts) : TString.cast(ts);
    });
};
var canMerge = function (obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
};
var mergeObj = function (a, b) {
    if (canMerge(a) && canMerge(b))
        return Object.fromEntries(__spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(Object.keys(a)), false), __read(Object.keys(b)), false))), false).map(function (key) {
            if (key in b) {
                if (key in a)
                    return [key, merge(a[key], b[key])];
                return [key, b[key]];
            }
            return [key, a[key]];
        }));
    return b;
};
// Frozen dictionary merge
var merge = function (a, b) {
    return Object.freeze(mergeObj(a, b));
};
/**
 * @category Dictionary
 */
export var nextDict = new NextCache(merge);
/**
 * @category Dictionary
 */
export var rootDict = Object.freeze({ $$dict: {} });
