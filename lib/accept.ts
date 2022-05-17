import { canonicaliseLocales } from "./resolveLocale";
import { LocaleStack } from "./types";

const parsePriority = (term: string): [number, string] => {
  const mt = term.match(/(\S*?)\s*;\s*(.*)/);
  if (mt) {
    const [, locale, args] = mt;
    const ma = args.match(/^q=(\d+(?:\.\d+)?)$/i);
    if (ma) {
      const q = Number(ma[1]);
      if (q >= 0 && q <= 1) return [q, locale];
    }
    return [0, locale];
  }
  return [1, term];
};

const cmp = (a: string | number, b: string | number) =>
  a < b ? -1 : a > b ? 1 : 0;

export const parseAcceptLanguage = (accept: string): LocaleStack =>
  canonicaliseLocales(
    accept
      .split(/\s*,\s*/)
      .map(parsePriority)
      .filter(t => t[0] > 0)
      .sort((a, b) => cmp(b[0], a[0]) || cmp(a[1], b[1]))
      .map(t => t[1])
  );
