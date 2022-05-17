import "./weakRef"; // Polyfill WeakRef for Opera

type StackArray = readonly string[];
type NextCache = { [key: string]: WeakRef<StackArray> };

const parentCache = new WeakMap<StackArray, StackArray | undefined>();
const nextCache = new WeakMap<StackArray, NextCache>();

const nextSlot = (stack: StackArray): NextCache => {
  let n = nextCache.get(stack);
  if (!n) nextCache.set(stack, (n = {}));
  return n;
};

const splice = (
  stack: StackArray,
  lang: string,
  path: StackArray
): StackArray => {
  const parent = parentCache.get(stack);
  // istanbul ignore next - can't happen
  if (!parent) throw new Error(`No parent!`);
  if (lang === stack[0]) return resolveLocales(parent, [lang, ...path]);
  return splice(parent, lang, path.concat(stack[0]));
};

const node = (stack: StackArray, parent?: StackArray): StackArray => {
  parentCache.set(stack, parent);
  return Object.freeze(stack);
};

export const resolveLocales = (
  stack: StackArray,
  langs: StackArray
): StackArray => {
  if (!langs.length) return stack;
  const tail = [...langs];
  const lang = tail.pop() as string;
  const slot = nextSlot(stack);

  const tryNext = slot[lang] && slot[lang].deref();
  // Cache hit
  if (tryNext) return resolveLocales(tryNext, tail);

  // Cache miss
  const newNext = stack.includes(lang)
    ? splice(stack, lang, [])
    : node([lang].concat(stack), stack);

  slot[lang] = new WeakRef<StackArray>(newNext);
  return resolveLocales(newNext, tail);
};

export const localeRoot = node([]);

export const canonicaliseLocales = (stack: StackArray) =>
  parentCache.has(stack) ? stack : resolveLocales(localeRoot, stack);
