import { parseTemplate, stringifyTemplate } from "./template";

describe("parseTemplate", () => {
  it("should parse and stringify template strings", () => {
    const tests = [
      { t: "Hello", want: ["Hello"] },
      { t: "%1", want: [{ index: 1 }] },
      { t: "%1%2", want: [{ index: 1 }, { index: 2 }] },
      { t: "%", want: ["%"] },
      { t: "%%", want: ["%"] },
      { t: "%%%", want: ["%%"] },
      { t: "%%%", want: ["%%"] },
      { t: "%1 [hello]", want: [{ index: 1 }, " [hello]"] },
      { t: "%%1[hello]", want: ["%1[hello]"] },
      {
        t: "%1[Apple %][]",
        want: [{ index: 1, name: "%1", text: "Apple %]%[" }]
      },
      { t: "%1[hello]", want: [{ index: 1, name: "%1", text: "hello" }] },
      {
        t: "%1[%1[%1[A]B]C]",
        want: [{ index: 1, name: "%1", text: "%1[%1[A]B]C" }]
      },
      {
        t: "before %1[%1[%1[[%]]B]C] after",
        want: [
          "before ",
          { index: 1, name: "%1", text: "%1[%1[%[%]]B]C" },
          " after"
        ]
      },
      { t: "[", want: ["["] },
      { t: "%1[%%1]", want: [{ index: 1, name: "%1", text: "%%1" }] },
      { t: "%1[]] OK!", want: [{ index: 1, name: "%1", text: "" }, "] OK!"] },

      // % in other contexts is literal
      { t: "%", want: ["%"] },
      { t: ".%", want: [".%"] },
      { t: "%.", want: ["%."] },
      { t: ".%.", want: [".%."] }
    ];

    for (const { t, want } of tests) {
      // Check idempotence of parse/stringify/repeat. The first parse is not
      // expected to be idempotent because allowed free '[', ']' etc are always
      // escape by stringifyTemplate. stringifyTemplate(parseTemplate(format))
      // canonicalises the format.
      const ast = parseTemplate(t);
      expect(ast).toEqual(want);
      const t2 = stringifyTemplate(ast);
      const ast2 = parseTemplate(t2);
      expect(ast2).toEqual(ast);
      const t3 = stringifyTemplate(ast2);
      expect(t3).toBe(t2);

      // Verify caching. Strings without placeholders aren't cached
      if (/%/.test(t3)) {
        const ast3 = parseTemplate(t3);
        expect(ast3).toBe(ast2); // toBe checks ref equality
      }
    }
  });

  it("should error on invalid template strings", () => {
    expect(() => parseTemplate("%1[Hello!")).toThrow(/Missing/i);
    expect(() => parseTemplate("%1[%1[x]")).toThrow(/Missing/i);
  });
});
