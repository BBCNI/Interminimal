import { searchOrder } from "./searchOrder";

describe("searchOrder", () => {
  it("should order more specific variants first", () => {
    const cases = [
      { langs: ["en-GB"], want: ["en-GB", "en"] },
      {
        langs: ["en-GB", "en-US-x-foo", "fr-CA"],
        want: ["en-GB", "en-US-x-foo", "en-US", "en", "fr-CA", "fr"]
      },
      {
        langs: ["en-GB", "en-US", "fr-CA", "en-AU", "fr"],
        want: ["en-GB", "en-US", "en", "fr-CA", "fr", "en-AU"]
      },
      {
        langs: ["en-GB", "en-US-x-foo", "en-US-x-bar"],
        want: ["en-GB", "en-US-x-foo", "en-US-x-bar", "en-US", "en"]
      },
      {
        langs: ["en-US-x-foo", "en-GB", "fr-CA", "en-US-x-bar"],
        want: [
          "en-US-x-foo",
          "en-US",
          "en-GB",
          "en",
          "fr-CA",
          "fr",
          "en-US-x-bar"
        ]
      },
      {
        langs: ["en", "en-GB", "en-US-x-foo", "fr-CA", "en-US-x-bar"],
        want: [
          "en",
          "en-GB",
          "en-US-x-foo",
          "en-US",
          "fr-CA",
          "fr",
          "en-US-x-bar"
        ]
      },
      {
        langs: ["en", "en-GB", "en-US", "en-US-x-foo", "fr-CA", "en-US-x-bar"],
        want: [
          "en",
          "en-GB",
          "en-US",
          "en-US-x-foo",
          "fr-CA",
          "fr",
          "en-US-x-bar"
        ]
      }
    ];
    for (const { langs, want } of cases)
      expect(searchOrder(langs)).toEqual(want);
  });

  it("should reject really long languages", () => {
    expect(() =>
      searchOrder(["this-is-a-really-long-language-name-which-should-not-work"])
    ).toThrow(/too long/);
  });

  it("should cache", () => {
    const so1 = searchOrder(["en", "fr"]);
    const so2 = searchOrder(["en", "en", "fr"]);
    expect(so1).toBe(so2);
  });
});
