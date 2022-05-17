import {
  canonicaliseLocales,
  localeRoot,
  resolveLocales
} from "./resolveLocale";

describe("resolveLocale", () => {
  it("should support simple locale paths", () => {
    const ls = resolveLocales(localeRoot, ["en"]);
    expect(ls).toEqual(["en"]);
  });

  it("should eliminate dupes", () => {
    const ls = resolveLocales(localeRoot, ["en", "cy", "en"]);
    expect(ls).toEqual(["en", "cy"]);
  });

  it("should provide stable objects for equivalent paths", () => {
    const ls1 = resolveLocales(localeRoot, ["cy", "fr", "en"]);
    const ls2 = resolveLocales(ls1, ["fr"]);
    expect(ls2).toEqual(["fr", "cy", "en"]);
    const ls3 = resolveLocales(localeRoot, ["fr", "cy", "en"]);
    expect(ls3).toBe(ls2);
    const ls4 = resolveLocales(ls2, ["fr", "cy", "en"]);
    expect(ls4).toBe(ls2);
  });

  // Coverage for cached case
  it("should avoid canonicalising things that are already canonical", () => {
    const c1 = canonicaliseLocales(["en", "fr", "en"]);
    expect(c1).toEqual(["en", "fr"]);
    const c2 = canonicaliseLocales(c1);
    expect(c2).toBe(c1);
  });
});
