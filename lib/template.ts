import { TemplateToken, TemplatePlaceholder } from "./types";

const escapePercent = (text: string) => text.replace(/([%\[\]])/g, "%$1");

const stringifyNode = (pl: string | TemplatePlaceholder) =>
  typeof pl === "string"
    ? escapePercent(pl)
    : `%${pl.index}` + ("text" in pl ? `[${pl.text}]` : "");

export const stringifyTemplate = (ast: TemplateToken[]) =>
  ast.map(stringifyNode).join("");

const parse = (format: string) => {
  // Use a capturing split to tokenise. We filter out empty tokens here so
  // that we don't trip over e.g. ["%1", "", "["] in the main loop. We want
  // to have ["%1", "["] instead.
  const tokens = format.split(/(%%|%\[|%]|%\d+|\[|])/).filter(t => t.length);

  const parsePart = (stopAt?: string) => {
    const out: TemplateToken[] = [];

    const put = (frag: string) => {
      if (out.length && typeof out[out.length - 1] === "string")
        out[out.length - 1] += frag;
      else out.push(frag);
    };

    while (true) {
      const tok = tokens.shift();

      if (stopAt) {
        if (!tok) throw new Error(`Missing ${stopAt}`);
        if (tok === stopAt) break;
      } else {
        if (!tok) break;
      }

      const m = tok.match(/^%(\d+|[%\[\]])$/);
      if (m) {
        // % escape?
        if (!/^\d+$/.test(m[1])) {
          put(m[1]);
          continue;
        }

        const pl: TemplatePlaceholder = { index: Number(m[1]) };

        // Following literal?
        if (tokens.length && tokens[0] === "[") {
          tokens.shift();
          pl.name = tok;
          // Because this is a recursive syntax but we want to flatten
          // it to a single level, we handle subexpressions by parsing
          // them and re-stringifying.
          pl.text = stringifyTemplate(parsePart("]"));
        }

        out.push(pl);
        continue;
      }
      put(tok);
    }

    return out;
  };

  return parsePart();
};

const cache: { [key: string]: TemplateToken[] } = {};

export const parseTemplate = (format: string) =>
  /%/.test(format)
    ? (cache[format] = cache[format] || parse(format))
    : [format];
