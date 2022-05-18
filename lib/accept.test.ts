import { parseAcceptLanguage } from "./accept";

describe("parseAcceptLanguage", () => {
  it("should handle a single preference", () => {
    expect(parseAcceptLanguage("en-GB")).toEqual(["en-GB"]);
  });

  it("should handle priorities", () => {
    expect(parseAcceptLanguage("en-AU;q=0.8,en-GB;q=0.9")).toEqual([
      "en-GB",
      "en-AU"
    ]);
    expect(parseAcceptLanguage("en-GB;q=0.9 , en-AU;q=0.8")).toEqual([
      "en-GB",
      "en-AU"
    ]);
  });

  it("should order lexically by default", () => {
    expect(parseAcceptLanguage("en-AU,en-GB")).toEqual(["en-AU", "en-GB"]);
    expect(parseAcceptLanguage("en-GB, en-AU")).toEqual(["en-AU", "en-GB"]);
  });

  it("should default to priority 1", () => {
    expect(parseAcceptLanguage("en-GB; q=1, en-AU")).toEqual([
      "en-AU",
      "en-GB"
    ]);
    expect(parseAcceptLanguage("en-GB, en-AU; q=1")).toEqual([
      "en-AU",
      "en-GB"
    ]);
  });

  it("should ignore bad priorities", () => {
    expect(parseAcceptLanguage("fr;b=9,en-GB;q=0.9,en-AU;q=0.8")).toEqual([
      "en-GB",
      "en-AU"
    ]);
    expect(parseAcceptLanguage("fr;q=2,en-GB;q=0.9,en-AU;q=0.8")).toEqual([
      "en-GB",
      "en-AU"
    ]);
  });

  it("should canonicalise", () => {
    expect(parseAcceptLanguage("en-Gb, eN;q=0.9, EN-GB;q=0.9")).toEqual([
      "en-GB",
      "en"
    ]);
  });

  it("should strip bad tags", () => {
    expect(parseAcceptLanguage("b0rk")).toEqual([]);
  });
});
