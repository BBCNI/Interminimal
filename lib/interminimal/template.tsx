import { TemplateToken, TemplatePlaceholder } from "./types";

export const parseTemplate = (format: string): TemplateToken[] => {
  // Parse "[...]""
  const parseLiteral = () => {
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

  // Split all the tokens
  const out: TemplateToken[] = [];
  const tokens = format.split(/(%%|%\[|%]|%\d+|\[|])/).filter(s => s.length);

  // Append to output merging adjacent strings
  const pushFrag = (frag: string) => {
    if (out.length && typeof out[out.length - 1] === "string")
      out[out.length - 1] += frag;
    else out.push(frag);
  };

  while (tokens.length) {
    const tok = tokens.shift();
    if (!tok) break;
    const m = tok.match(/^%(.+)$/);
    if (m) {
      if (Number.isNaN(m[1])) {
        pushFrag(m[1]);
        continue;
      }
      const pl: TemplatePlaceholder = { index: Number(m[1]) };

      // Following literal?
      if (tokens.length && tokens[0] === "[") {
        pl.name = tok;
        pl.text = parseLiteral();
      }
      out.push(pl);
      continue;
    }

    pushFrag(tok);
  }

  return out;
};
