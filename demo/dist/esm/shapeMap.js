var objToKey = new WeakMap();
// Given an object return the key string for its shape. Cached
// for objects we've seen before, reasonably fast otherwise
var resolveKey = function (obj) {
    var key = objToKey.get(obj);
    if (key !== undefined)
        return key;
    var newKey = Object.keys(obj).sort().join(" ");
    objToKey.set(obj, newKey);
    return newKey;
};
var shapes = {};
export function shapeSlot(obj) {
    var key = resolveKey(obj);
    return (shapes[key] = shapes[key] || new WeakMap());
}