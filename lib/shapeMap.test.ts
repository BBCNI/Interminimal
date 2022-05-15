import { shapeSlot } from "./shapeMap";

describe("shapeMap", () => {
  it("should provide stable slots", () => {
    const obj1 = { a: "Foo", b: "Bar", c: "Baz" };
    const obj2 = { a: 1, b: 2, c: 3 };
    const obj3 = { foo: 1, bar: 2 };
    const s1 = shapeSlot(obj1);
    const s2 = shapeSlot(obj2);
    const s3 = shapeSlot(obj3);
    expect(s2).toBe(s1);
    expect(s3).not.toBe(s1);
  });

  // This can only ever fail with 100% coverage required
  it("should cache obj to key mapping", () => {
    const obj1 = { a: "Foo", b: "Bar", c: "Baz" };
    const s1 = shapeSlot(obj1);
    const s2 = shapeSlot(obj1);
    expect(s2).toBe(s1);
  });

  it("should return a WeakMap", () => {
    const obj1 = { a: "Foo", b: "Bar", c: "Baz" };
    const obj2 = { a: 1, b: 2, c: 3 };
    const obj3 = { foo: 1, bar: 2 };
    const s1 = shapeSlot(obj1);
    const s2 = shapeSlot(obj2);
    const s3 = shapeSlot(obj3);
    expect(s1).toBeInstanceOf(WeakMap);
    expect(s2).toBeInstanceOf(WeakMap);
    expect(s3).toBeInstanceOf(WeakMap);
    const stack = ["en", "fr"];
    s1.set(stack, true);
    expect(s2.get(stack)).toBe(true);
    expect(s3.get(stack)).toBeUndefined();
  });
});
