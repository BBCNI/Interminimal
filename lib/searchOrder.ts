import { canonicaliseLocales } from "./resolveLocale";
import { LocaleStack } from "./types";

interface LangNode {
  readonly lang: string;
  readonly children: readonly LangNode[];
}

const MaxLength = 35;

const expandLang = (lang: string): LocaleStack => {
  if (lang.length > MaxLength) throw new Error(`BCP 47 language tag too long`);
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return [lang];
  if (idx > 2 && lang.charAt(idx - 2) === "-")
    return expandLang(lang.slice(0, idx - 2)).concat(lang);
  return expandLang(lang.slice(0, idx)).concat(lang);
};

const makeNode = (path: LocaleStack): LangNode => {
  // istanbul ignore next - can't happen
  if (path.length === 0) throw new Error(`Empty thing`);
  const [lang, ...tail] = path;
  if (tail.length) return { lang, children: [makeNode(tail)] };
  return { lang, children: [] };
};

const mergeNodes = (a: LangNode, b: LangNode): LangNode => ({
  lang: a.lang,
  children: groupTree([...a.children, ...b.children])
});

// Group shared prefixes.
const groupTree = (tree: readonly LangNode[]): readonly LangNode[] => {
  if (tree.length < 2) return tree;
  const [head, next, ...tail] = tree;
  // The head.children.length check is subtle. It's the thing
  // that stops e.g. ["en", "en-US"] from turning into ["en-US", "en"]
  // while allowing ["en-US"] to turn into ["en-US", "en"]
  if (head.lang === next.lang && head.children.length)
    return groupTree([mergeNodes(head, next), ...tail]);
  return [head, ...groupTree([next, ...tail])];
};

// Render node in depth first postfix order so more specific
// tags come first
const renderNode = (node: LangNode): LocaleStack => [
  ...renderTree(node.children),
  node.lang
];

const renderTree = (tree: readonly LangNode[]): LocaleStack =>
  tree.flatMap(renderNode);

export const searchOrder = (langs: LocaleStack): LocaleStack =>
  canonicaliseLocales(
    renderTree(groupTree(langs.map(expandLang).map(makeNode)))
  );
