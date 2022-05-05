const parseTemplate = format => {
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
  };

  const tokens = format.split(/(%%|%\[|%]|%\d+|\[|])/).filter(s => s.length);
  const out = [];

  const pushFrag = frag => {
    if (out.length && typeof out[out.length - 1] === "string")
      out[out.length - 1] += frag;
    else out.push(frag);
  };

  while (tokens.length) {
    const tok = tokens.shift();
    const m = tok.match(/^%(.+)$/);
    if (m) {
      if (isNaN(m[1])) {
        pushFrag(m[1]);
        continue;
      }
      const pl = { index: Number(m[1]) };

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

const templates = [
  "This is a %1[useful link] but [this] is %2%[square%] and look: %1[Nested %1[foo]]"
];

for (const format of templates) {
  const ast = parseTemplate(format);
  console.log(ast);
}
