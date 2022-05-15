const lc = (str: string): string => str.toLowerCase();
const cmp = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

// Order BCP47 tags so that more specific ones come first
const cmpTag = (a: string, b: string): number => {
  const ap = a.split(/-/);
  const bp = b.split(/-/);
  while (ap.length && bp.length) {
    const c = cmp(ap.shift() as string, bp.shift() as string);
    if (c) return c;
  }
  return ap.length ? -1 : 1;
};

const pred = (tag: string, lang: string): boolean => {
  if (tag === lang) return true;
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return false;
  if (lang.charAt(idx - 2) === "-") return pred(tag, lang.slice(0, idx - 2));
  return pred(tag, lang.slice(0, idx));
};

export function bestLocale(
  tags: string[],
  langs: string[]
): string | undefined {
  const canon = tags.slice(0).sort(cmpTag);
  for (const lang of langs.map(lc))
    for (const tag of canon) if (pred(lc(tag), lang)) return tag;
}
