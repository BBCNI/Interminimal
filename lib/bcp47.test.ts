import { bestLocale } from "./bcp47";

const runTests = (tests: any[]) => {
  for (const { tags, langs, want } of tests) {
    // expect(bestLocale(tags, langs)).toBe(want);
    expect(bestLocale(tags, langs)).toBe(want);
  }
};

describe("bestLocale", () => {
  it("should handle literal matches", () => {
    runTests([{ tags: ["en", "fr"], langs: ["de", "fr"], want: "fr" }]);
  });

  it("should handle fuzzy matches", () => {
    runTests([
      { tags: ["en", "fr"], langs: ["en-GB", "fr"], want: "en" },
      {
        tags: ["en-GB", "fr", "fr-CA", "en"],
        langs: ["en-GB-x-foo", "en", "fr"],
        want: "en-GB"
      },
      {
        tags: ["en-GB", "fr", "fr-CA", "en"],
        langs: ["fr-CA", "en-GB-x-foo", "en", "fr"],
        want: "fr-CA"
      }
    ]);
  });
});
