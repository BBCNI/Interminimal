"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDict = exports.nextDict = exports.checkDictionary = void 0;
var string_1 = require("./string");
var nextCache_1 = require("./nextCache");
/**
 * @category Dictionary
 */
var checkDictionary = function (dictionary) {
    if (!("$$dict" in dictionary))
        throw new Error("Invalid dictionary (missing $$dict key)");
    Object.values(dictionary.$$dict).map(function (ts) {
        return "$$dict" in ts ? (0, exports.checkDictionary)(ts) : string_1.TString.cast(ts);
    });
};
exports.checkDictionary = checkDictionary;
var canMerge = function (obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
};
// Frozen dictionary merge
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
var merge = function (a, b) { return Object.freeze(mergeObj(a, b)); };
/**
 * @category Dictionary
 */
exports.nextDict = new nextCache_1.NextCache(merge);
/**
 * @category Dictionary
 */
exports.rootDict = Object.freeze({ $$dict: {} });
