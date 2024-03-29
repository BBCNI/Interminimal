export interface TemplatePlaceholder {
  index: number;
  name?: string;
  text?: string;
}

export type TemplateToken = string | TemplatePlaceholder;

const escapePercent = (text: string) => text.replace(/([%\[\]])/g, "%$1");

const stringifyNode = (pl: TemplateToken) =>
  typeof pl === "string"
    ? escapePercent(pl)
    : `%${pl.index}` + ("text" in pl ? `[${pl.text}]` : "");

export const stringifyTemplate = (ast: TemplateToken[]) =>
  ast.map(stringifyNode).join("");

const parse = (format: string) => {
  // Use a capturing split to tokenise. We filter out empty tokens here so
  // that we don't trip over e.g. ["%1", "", "["] in the main loop. We want
  // to have ["%1", "["] instead.
  const tokens = format
    .split(/(%\d+|%%|%\[|%\]|\[|\]|%)/)
    .filter(t => t.length);

  // Parse the next tokens
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
        if (process.env.NODE_ENV !== "production")
          if (!tok) throw new Error(`Missing ${stopAt}`);
        if (tok === stopAt) break;
      }

      if (!tok) break;

      const m = tok.match(/^%(\d+|.)$/);
      if (m) {
        const arg = m[1];

        // Not a number so % escape?
        if (!/^\d+$/.test(arg)) {
          put(arg);
          continue;
        }

        const pl: TemplatePlaceholder = { index: Number(arg) };

        // Following literal?
        if (tokens.length && tokens[0] === "[") {
          tokens.shift();
          pl.name = tok;
          // Because this is a recursive syntax that we want to flatten
          // to a single level, we handle subexpressions by parsing
          // and re-stringifying them.
          pl.text = stringifyTemplate(parsePart("]"));
        }

        out.push(pl);
        continue;
      }

      // Just stash the token
      put(tok);
    }

    return out;
  };

  return parsePart();
};

const cache: Record<string, TemplateToken[]> = {};

export const parseTemplate = (format: string): TemplateToken[] =>
  /%/.test(format)
    ? (cache[format] = cache[format] || parse(format))
    : [format];
