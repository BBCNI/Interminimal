import { LocaleStack } from "./localeStack";

describe("LocaleStack", () => {
  it("should support simple locale paths", () => {
    const ls = new LocaleStack().resolve(["en"]);
    expect(ls.stack).toEqual(["en"]);
  });

  it("should eliminate dupes", () => {
    const root = new LocaleStack();
    const ls = root.resolve(["en", "cy", "en"]);
    expect(ls.stack).toEqual(["en", "cy"]);
  });

  it("should provide stable objects for equivalent paths", () => {
    const root = new LocaleStack();
    const ls1 = root.resolve(["cy", "fr", "en"]);
    const ls2 = ls1.resolve(["fr"]);
    expect(ls2.stack).toEqual(["fr", "cy", "en"]);
    const ls3 = root.resolve(["fr", "cy", "en"]);
    expect(ls3.stack).toBe(ls2.stack);
    const ls4 = ls2.resolve(["fr", "cy", "en"]);
    expect(ls4.stack).toBe(ls2.stack);
  });

  it("should need a parent", () => {
    expect(() => new LocaleStack(["cy", "en"])).toThrow(/a stack/i);
  });
});
