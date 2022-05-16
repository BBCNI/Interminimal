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
    expect(ctx.languages).toEqual(["cy", "en"]);
    expect(ctx.language).toBe("cy");
    expect(ctx.ambience).toBe("cy");
    const ctx2 = ctx.derive({ lang: "de", defaultLang: "fr" });
    expect(ctx2.languages).toEqual(["de", "fr", "cy", "en"]);
    expect(ctx2.language).toBe("de");
    expect(ctx2.ambience).toBe("de");
    const ctx3 = ctx2.derive({ lang: "en" });
    expect(ctx3.languages).toEqual(["en", "de", "fr", "cy"]);
    expect(ctx3.language).toBe("en");
    expect(ctx3.ambience).toBe("en");
    const ctx4 = new LangContext({ lang: ["en", "de", "fr", "cy"] });
    expect(ctx4.languages).toBe(ctx3.languages);
  });

  it("should honor defaultLang", () => {
    const ctx = new LangContext({ defaultLang: "en" });
    const ctx2 = ctx.derive({ defaultLang: "fr" });
    expect(ctx2.languages).toEqual(["fr", "en"]);
  });

  it("should allow ambience overload", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en" });
    const amb1 = ctx.derive({ ambient: "en" });
    const amb2 = amb1.derive({ ambient: "en" });

    expect(ctx.ambience).toBe("cy");
    expect(ctx.language).toBe("cy");
    expect(ctx.languages).toEqual(["cy", "en"]);

    expect(amb1.ambience).toBe("en");
    expect(amb1.language).toBe("cy");
    expect(amb1.languages).toEqual(["cy", "en"]);

    expect(amb2.ambience).toBe("en");
    expect(amb2.language).toBe("cy");
    expect(amb2.languages).toEqual(["cy", "en"]);
  });

  it("should translate strings", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const ts = ctx.translate("Hello");
    expect(ts.toString()).toBe("Hello");
    expect(ts.language).toBe("en");
  });

  it("should resolve tags", () => {
    const ctx = new LangContext({ lang: "cy", defaultLang: "en", dictionary });
    const ts = ctx.resolve(["site"]).toLang(["cy"]);
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
    const ts = next.resolve(["heading"]).toLang(["de"]);
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
    expect(ctx.resolve(["site"]).toLang(["en"]).toString()).toBe(
      "Interminimal"
    );
    expect(maybe.resolve(["site"]).toLang(["en"]).toString()).toBe(
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
  });

  it("should translate text and props", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const got = ctx.translateTextAndProps(["site"]);
    expect(got).toEqual({ str: "Interminimal", props: { lang: "en" } });
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

  it("should canonicalise locale stacks", () => {
    const ctx = new LangContext({ lang: "fr", defaultLang: "en", dictionary });
    const enCtx = ctx.derive({ lang: "en" });
    const frCtx = enCtx.derive({ lang: "fr" });
    // Sanity check
    expect(frCtx.languages).toEqual(["fr", "en"]);
    // Check reference identity (toBe or not to be)
    expect(LangContext.canonicaliseLocales(["fr", "fr", "en", "fr"])).toBe(
      frCtx.languages
    );
    expect(LangContext.canonicaliseLocales(["fr", "en", "fr"])).toBe(
      frCtx.languages
    );
  });
});
