const lc = (str: string): string => str.toLowerCase();

const lookup = (tags: Set<string>, lang: string): string | undefined => {
  if (tags.has(lc(lang))) return lang;
  // any extensions?
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return;
  // foo-x-bar?
  if (idx > 2 && lang.charAt(idx - 2) === "-")
    return lookup(tags, lang.slice(0, idx - 2));
  // foo-BAR
  return lookup(tags, lang.slice(0, idx));
};

export const bestLocale = (
  tags: string[],
  langs: string[]
): string | undefined => {
  const ts = new Set(tags.map(lc));
  for (const lang of langs) {
    const m = lookup(ts, lang);
    if (m) return m;
  }
};
