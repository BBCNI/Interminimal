import { TString } from "./string";

describe("TSString", () => {
  it("should handle literals", () => {
    const ts = TString.literal("Hello", "en");
    expect(ts.language).toBe("en");
    expect(ts.toString()).toBe("Hello");
    expect(ts.dictionary).toEqual({ en: "Hello" });
    const tsf = ts.toLang("fr"); // can't do it but not an error
    expect(tsf.language).toBe("en");
    expect(tsf.toString()).toBe("Hello");
  });

  it("should fail if explicit lang is absent from dictionary", () => {
    expect(() => new TString({ huh: "Huh?" }, "en")).toThrow(/not in/);
  });

  it("should cast a fat string", () => {
    const ts = TString.cast({ en: "Hello" });
    expect(ts.dictionary).toEqual({ en: "Hello" });
    const tsf = ts.toLang("fr");
    expect(tsf.language).toBe("en");
    expect(tsf.toString()).toBe("Hello");
    expect(() => ts.language).toThrow(/must have/);
  });

  it("should cast a TString", () => {
    const ts1 = TString.cast({ en: "Hello" });
    const ts2 = TString.cast(ts1);
    expect(ts1).toBe(ts2);
  });

  it("should set language of existing TString in cast", () => {
    const ts1 = TString.cast({ en: "Hello" });
    const ts2 = TString.cast(ts1, "fr");
    expect(ts2.language).toBe("en");
    expect(ts2).not.toBe(ts1);
    expect(() => ts1.language).toThrow(/must have/);
  });

  it("should handle undefined / null in toLang args", () => {
    const ts = new TString({ en: "Hello", de: "Hallo" }, "en");
    const tsde = ts.toLang(["cy", null, "de", "en"] as string[]);
    expect(tsde.language).toBe("de");
    expect(tsde.toString()).toBe("Hallo");
  });

  it("should return this if no translation required", () => {
    const ts = new TString({ en: "Hello", de: "Hallo" }, "en");
    const ts2 = ts.toLang(["fr", "en"]);
    expect(ts2).toBe(ts);
  });

  it("should return any translation if no match", () => {
    const ts = new TString({ en: "Hello" });
    const ts2 = ts.toLang("fr");
    expect(ts2.language).toBe("en");
  });

  it("should fail if no languages are available", () => {
    const ts = new TString({});
    expect(() => ts.toLang("en")).toThrow(/no translations/i);
  });

  it("should lookup plurals", () => {
    const ts = new TString({
      en: { one: "%1 cat", other: "%1 cats" },
      de: { one: "%1 Katze", other: "%1 Katzen" },
      cy: {
        zero: "%1 cathod",
        one: "%1 gath",
        two: "%1 gath",
        few: "%1 cath",
        many: "%1 chath",
        other: "%1 cath"
      }
    });

    const counts = [0, 1, 1.5, 2, 3, 6, 42];

    const tests = {
      en: [
        "0 cats",
        "1 cat",
        "1.5 cats",
        "2 cats",
        "3 cats",
        "6 cats",
        "42 cats"
      ],
      de: [
        "0 Katzen",
        "1 Katze",
        "1.5 Katzen",
        "2 Katzen",
        "3 Katzen",
        "6 Katzen",
        "42 Katzen"
      ],
      cy: [
        "0 cathod",
        "1 gath",
        "1.5 cath",
        "2 gath",
        "3 cath",
        "6 chath",
        "42 cath"
      ]
    };

    for (const [lang, want] of Object.entries(tests)) {
      const tsx = ts.toLang(lang);
      expect(tsx.language).toBe(lang);
      const got = counts.map(count =>
        tsx.toString(count).replace("%1", String(count))
      );
      expect(got).toEqual(want);
    }
  });

  it("should default to a count of 1", () => {
    const ts = new TString({ en: { one: "cat", other: "cats" } }, "en");
    expect(ts.toString(0)).toBe("cats");
    expect(ts.toString()).toBe("cat");
  });

  it("should fail on unmatched plurals", () => {
    const ts = new TString({ en: { other: "cats" } });
    expect(() => ts.toLang("en").toString(1)).toThrow(/map plural/);
    expect(() => ts.toLang("en").toString()).toThrow(/map plural/);
  });
});