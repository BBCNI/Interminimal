const objToKey = new WeakMap<any, string>();

// Given an object return the key string for its shape. Cached
// for objects we've seen before, reasonably fast otherwise
const resolveKey = (obj: { [key: string]: any }): string => {
  const key = objToKey.get(obj);
  if (key !== undefined) return key;
  const newKey = Object.keys(obj).sort().join(" ");
  objToKey.set(obj, newKey);
  return newKey;
};

const shapes: { [key: string]: WeakMap<any, any> } = {};

export function shapeSlot(obj: { [key: string]: any }): WeakMap<any, any> {
  const key = resolveKey(obj);
  return (shapes[key] = shapes[key] || new WeakMap());
}
