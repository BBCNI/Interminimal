import "./weakRef"; // Polyfill WeakRef for Opera

export type LocaleStack = readonly string[];

type NextCache = { [key: string]: WeakRef<LocaleStack> };

const parentCache = new WeakMap<LocaleStack, LocaleStack | undefined>();
const nextCache = new WeakMap<LocaleStack, NextCache>();

const nextSlot = (stack: LocaleStack): NextCache => {
  let n = nextCache.get(stack);
  if (!n) nextCache.set(stack, (n = {}));
  return n;
};

const splice = (
  stack: LocaleStack,
  lang: string,
  path: LocaleStack
): LocaleStack => {
  const parent = parentCache.get(stack);
  // istanbul ignore next - can't happen
  if (!parent) throw new Error(`No parent!`);
  if (lang === stack[0]) return resolveLocales(parent, [lang, ...path]);
  return splice(parent, lang, path.concat(stack[0]));
};

const node = (stack: LocaleStack, parent?: LocaleStack): LocaleStack => {
  parentCache.set(stack, parent);
  return Object.freeze(stack);
};

const resolve = (stack: LocaleStack, langs: LocaleStack): LocaleStack => {
  if (!langs.length) return stack;
  const tail = [...langs];
  const lang = tail.pop() as string;
  const slot = nextSlot(stack);

  const tryNext = slot[lang] && slot[lang].deref();
  // Cache hit
  if (tryNext) return resolve(tryNext, tail);

  // Cache miss
  const newNext = stack.includes(lang)
    ? splice(stack, lang, [])
    : node([lang].concat(stack), stack);

  slot[lang] = new WeakRef<LocaleStack>(newNext);
  return resolve(newNext, tail);
};

/**
 * Return the stack that is the result of prepending a
 * (possibly empty) list of locales to a locale stack
 *
 * ```typescript
 * const ls1 = resolveLocales(localeRoot, ["en", "fr"]);
 * const ls2 = resolveLocales(ls1, ["fr"]); // now ["fr", "en"]
 * const ls3 = resolveLocales(localeRoot, ["fr", "en"]); // also ["fr", "en"]
 * if (ls2 === ls3) console.log("Same thing!");
 * ```
 *
 * @param stack
 * @param langs a list of langs to prepend to the stack
 * @returns a stack node with the prepended langs
 * @category Locale
 */
export const resolveLocales = (
  stack: LocaleStack,
  langs: LocaleStack
): LocaleStack => resolve(canonicaliseLocales(stack), langs);

/**
 * A global empty locale stack which equals [].
 *
 * @category Locale
 */

export const localeRoot = node([]);

/**
 * Canonicalise a list of languages.
 *
 * ```typescript
 * console.log(
 *   canonicaliseLocales(["en", "fr", "en", "de", "de", "fr", "cy", "de"])
 * );
 * // ["en", "fr", "de", "cy"]
 * ```
 *
 * Equivalent language lists canonicalise to the same array object and can therefore
 * be used as the key for a `Map` or `Set`.
 *
 * @param stack the list of languages to canonicalise
 * @returns the canonical language stack
 * @category Locale
 */
export const canonicaliseLocales = (stack: LocaleStack) =>
  parentCache.has(stack) ? stack : resolve(localeRoot, stack);
