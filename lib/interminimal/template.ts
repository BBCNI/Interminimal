import { TemplateToken, TemplatePlaceholder } from ".";

const parse = (format: string): TemplateToken[] => {
  // Use a capturing split to tokenise. We filter out empty tokens here so
  // that we don't trip over e.g. ["%1", "", "["] in the main loop. We want
  // to have ["%1", "["] instead.
  const tokens = format.split(/(%%|%\[|%]|%\d+|\[|])/).filter(t => t.length);

  // Parse "[...]""
  const literal = () => {
    tokens.shift(); // "["
    const out = [];
    let level = 0;
    while (tokens.length) {
      const tok = tokens.shift();
      if (tok === "]") {
        if (level === 0) return out.join("");
        level--;
      } else if (tok === "[") {
        level++;
      }
      out.push(tok);
    }
    throw new Error(`Missing ] in template`);
  };

  const out: TemplateToken[] = [];

  // Append to output, merging adjacent strings
  const put = (frag: string) => {
    if (out.length && typeof out[out.length - 1] === "string")
      out[out.length - 1] += frag;
    else out.push(frag);
  };

  while (true) {
    const tok = tokens.shift();
    if (tok === undefined) break;
    const m = tok.match(/^%(\d+|[%\[\]])$/);
    if (m) {
      // % escape?
      if (Number.isNaN(m[1])) {
        put(m[1]);
        continue;
      }

      const pl: TemplatePlaceholder = { index: Number(m[1]) };

      // Following literal?
      if (tokens.length && tokens[0] === "[") {
        pl.name = tok;
        pl.text = literal();
      }

      out.push(pl);
      continue;
    }

    put(tok);
  }

  return out;
};

const cache: { [key: string]: TemplateToken[] } = {};

export const parseTemplate = (format: string) =>
  /%/.test(format)
    ? (cache[format] = cache[format] || parse(format))
    : [format];
