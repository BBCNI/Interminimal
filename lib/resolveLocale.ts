import "./weakRef"; // Polyfill WeakRef for Opera

import { LocaleStack } from "./types";

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

export const resolveLocales = (
  stack: LocaleStack,
  langs: LocaleStack
): LocaleStack => {
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

  slot[lang] = new WeakRef<LocaleStack>(newNext);
  return resolveLocales(newNext, tail);
};

export const localeRoot = node([]);

export const canonicaliseLocales = (stack: LocaleStack) =>
  parentCache.has(stack) ? stack : resolveLocales(localeRoot, stack);
