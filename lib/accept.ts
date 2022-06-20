import { safeCanonicaliseLanguage } from "./bcp47";
import { canonicaliseLocales, LocaleStack } from "./resolveLocale";

const parsePriority = (term: string): [number, string] => {
  const mt = term.match(/(\S*?)\s*;\s*(.*)/);
  if (mt) {
    const [, locale, args] = mt;
    const ma = args.match(/^q=(\d+(?:\.\d+)?)$/i);
    if (ma) {
      const q = Number(ma[1]);
      if (q >= 0 && q <= 1) return [q, locale];
    }
    return [-1, ""];
  }
  return [1, term];
};

const cmp = <T extends string | number>(a: T, b: T): number =>
  a < b ? -1 : a > b ? 1 : 0;

const canonTag = (tag: string): string[] => {
  // We're dealing with user input so use the uncached method.
  // If we used the cached version we'd be vulnerable to
  // cache stuffing attacks.
  const canon = safeCanonicaliseLanguage(tag);
  return canon ? [canon] : [];
};

export const maxAcceptLanguageLength = 200;

/**
 * Parse an HTTP Accept-Language header. Badly formed languages are
 * dropped, languages are canonicalised.
 *
 * ```typescript
 * const stack = parseAcceptLanguage("fr;b=9,en-GB;q=0.9,en-AU;q=0.8");
 * console.log(stack); // [ "en-GB", "en-AU" ]
 * ```
 *
 * @param accept the contents of the header
 * @returns a priority ordered language stack
 * @category Locale
 */
export const parseAcceptLanguage = (accept: string): LocaleStack =>
  canonicaliseLocales(
    accept
      .slice(0, maxAcceptLanguageLength)
      .split(/\s*,\s*/)
      .map(parsePriority)
      .filter(t => t[0] >= 0)
      .sort((a, b) => cmp(b[0], a[0]))
      .map(t => t[1])
      .flatMap(canonTag)
  );
