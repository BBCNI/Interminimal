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
});
