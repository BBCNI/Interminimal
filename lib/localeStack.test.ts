import { canonicaliseLocales, localeRoot, LocaleStack } from "./localeStack";

describe("LocaleStack", () => {
  it("should support simple locale paths", () => {
    const ls = localeRoot.resolve(["en"]);
    expect(ls.stack).toEqual(["en"]);
  });

  it("should eliminate dupes", () => {
    const ls = localeRoot.resolve(["en", "cy", "en"]);
    expect(ls.stack).toEqual(["en", "cy"]);
  });

  it("should provide stable objects for equivalent paths", () => {
    const ls1 = localeRoot.resolve(["cy", "fr", "en"]);
    const ls2 = ls1.resolve(["fr"]);
    expect(ls2.stack).toEqual(["fr", "cy", "en"]);
    const ls3 = localeRoot.resolve(["fr", "cy", "en"]);
    expect(ls3.stack).toBe(ls2.stack);
    const ls4 = ls2.resolve(["fr", "cy", "en"]);
    expect(ls4.stack).toBe(ls2.stack);
  });

  it("should need a parent", () => {
    expect(() => new LocaleStack(["cy", "en"])).toThrow(/a stack/i);
  });

  // Coverage for cached case
  it("should avoid canonicalising things that are already canonical", () => {
    const c1 = canonicaliseLocales(["en", "fr", "en"]);
    expect(c1).toEqual(["en", "fr"]);
    const c2 = canonicaliseLocales(c1);
    expect(c2).toBe(c1);
  });
});
