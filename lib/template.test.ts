import { parseTemplate } from "./template";

describe("parseTemplate", () => {
  it("should parse tokens", () => {
    const tests = [
      { t: "%1", want: [{ index: 1 }] },
      { t: "%1%2", want: [{ index: 1 }, { index: 2 }] },
      { t: "%", want: ["%"] },
      { t: "%%", want: ["%"] },
      { t: "%%%", want: ["%%"] },
      { t: "%%%", want: ["%%"] },
      { t: "%1 [hello]", want: [{ index: 1 }, " [hello]"] },
      { t: "%%1[hello]", want: ["%1[hello]"] },
      {
        t: "%1[Apple %]%[]",
        want: [{ index: 1, name: "%1", text: "Apple %]%[" }]
      },
      { t: "%1[hello]", want: [{ index: 1, name: "%1", text: "hello" }] }
    ];
    for (const { t, want } of tests) {
      const ast = parseTemplate(t);
      expect(ast).toEqual(want);
    }
  });
});
