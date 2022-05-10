import { LangContext } from "./context";
import { TString } from "./string";
import { TDictionaryRoot } from "./types";

const dictionary: TDictionaryRoot = {
  $$dict: {
    site: { en: "Interminimal" },
    heading: {
      en: "Let's Translate!",
      fr: "Traduisons!",
      de: "Lassen Sie uns übersetzen!"
    },
    maybe: { $$dict: { site: { en: "Something else" } } }
  }
};

describe("LangContext", () => {
  it("should make an empty context", () => {
    const ctx = new LangContext();
    expect(ctx).toBeDefined();
  });

  it("should create a language stack", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en" });
    expect(ctx.stack).toEqual(["cy", "en"]);
    expect(ctx.language).toBe("cy");
    expect(ctx.ambience).toBe("cy");
    const ctx2 = ctx.derive({ lang: "de", defaultLang: "fr" });
    expect(ctx2.stack).toEqual(["de", "cy", "en"]);
    expect(ctx2.language).toBe("de");
    expect(ctx2.ambience).toBe("de");
    const ctx3 = ctx2.derive({ lang: "en" });
    expect(ctx3.stack).toEqual(["en", "de", "cy"]);
    expect(ctx3.language).toBe("en");
    expect(ctx3.ambience).toBe("en");
  });

  it("should translate strings", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const ts = ctx.translate("Hello");
    expect(ts.toString()).toBe("Hello");
    expect(ts.language).toBe("en");
  });

  it("should resolve tags", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const ts = ctx.resolve(["site"]).toLang("cy");
    expect(ts.toString()).toBe("Interminimal");
    expect(ts.language).toBe("en");
    expect(() => ctx.resolve(["this", "that"])).toThrow(/must be/);
  });

  it("should fail when dictionary tag doesn't refer to a dictionary", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    expect(() => ctx.derive({ dictionaryFromTag: "site" })).toThrow(/is not/i);
  });

  it("should fail when tags refer to dictionaries", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    expect(() => ctx.resolve(["maybe"])).toThrow(/is a/i);
  });

  it("should consult parent contexts", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const next = ctx.derive({ lang: "fr" });
    const ts = next.resolve(["heading"]).toLang("de");
    expect(ts.toString()).toBe("Lassen Sie uns übersetzen!");
  });

  it("should render dictionary substitutions", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const ts = new TString({ en: "Hello, this is %{site}" }, "en");
    const str = ctx.render(ts);
    expect(str).toBe("Hello, this is Interminimal");
  });

  it("should resolve t-* properties", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const props = { "t-alt": ["heading"], "src": "/spinach.png" };
    const got = ctx.resolveMagicProps(props);
    expect(got).toEqual({ alt: "Traduisons!", src: "/spinach.png" });
  });

  it("should resolve t-* properties with language override", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const props = { "t-alt": ["heading"], "src": "/spinach.png" };
    const got = ctx.resolveMagicProps(props, "en");
    expect(got).toEqual({ alt: "Let's Translate!", src: "/spinach.png" });
  });

  it("should consult nested dictionaries", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const maybe = ctx.derive({ dictionaryFromTag: "maybe" });
    expect(ctx.resolve(["site"]).toLang("en").toString()).toBe("Interminimal");
    expect(maybe.resolve(["site"]).toLang("en").toString()).toBe(
      "Something else"
    );
    expect(() => ctx.derive({ dictionaryFromTag: "site" })).toThrow(
      /not a dict/i
    );
  });

  it("should resolve <T> props", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    expect(() => ctx.resolveTranslationProps()).toThrow(/text or tag/i);
    expect(() => ctx.resolveTranslationProps("foo", "bar")).toThrow(/both/i);
    expect(ctx.resolveTranslationProps("site").toString()).toBe("Interminimal");
    expect(
      ctx.resolveTranslationProps(undefined, { en: "One", fr: "Un" }).toString()
    ).toBe("Un");
  });

  it("should throw on unknown tags", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    expect(() => ctx.resolve(["doesNotExits"])).toThrow(/No translation/i);
  });

  it("should translate text and props in another language", () => {
    const ctx = new LangContext({ lang: "en", defaultLang: "fr", dictionary });
    const got = ctx.translateTextAndProps(["site"], { ok: true });
    expect(got).toEqual({ str: "Interminimal", props: { ok: true } });
    console.log(got);
  });

  it("should translate text and props", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const got = ctx.translateTextAndProps(["site"]);
    expect(got).toEqual({ str: "Interminimal", props: { lang: "en" } });
    console.log(got);
  });

  it("should throw if dictionary is invalid", () => {
    expect(
      () => new LangContext({ dictionary: {} as TDictionaryRoot })
    ).toThrow(/invalid/i);
  });

  it("should throw if dictionary and dictionaryFromTag both found", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    expect(() =>
      ctx.derive({
        dictionary,
        dictionaryFromTag: "foo"
      })
    ).toThrow(/both/i);
  });

  it("should use parent stack if no override", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const ctx2 = ctx.derive();
    expect(ctx2.stack).toBe(ctx.stack);
  });
});
