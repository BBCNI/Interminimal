import { canonicaliseLocales } from "./resolveLocale";

interface LangNode {
  readonly lang: string;
  readonly children: readonly LangNode[];
}

const MaxLength = 35;

const expandLang = (lang: string): readonly string[] => {
  if (lang.length > MaxLength) throw new Error(`BCP 47 language tag too long`);
  const idx = lang.lastIndexOf("-");
  if (idx < 0) return [lang];
  if (idx > 2 && lang.charAt(idx - 2) === "-")
    return expandLang(lang.slice(0, idx - 2)).concat(lang);
  return expandLang(lang.slice(0, idx)).concat(lang);
};

const makeNode = (path: readonly string[]): LangNode => {
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
  if (head.lang === next.lang)
    return groupTree([mergeNodes(head, next), ...tail]);
  return [head, ...groupTree([next, ...tail])];
};

// Render node in depth first postfix order so more specific
// tags come first
const renderNode = (node: LangNode): readonly string[] => [
  ...renderTree(node.children),
  node.lang
];

const renderTree = (tree: readonly LangNode[]): readonly string[] =>
  tree.flatMap(renderNode);

export const searchOrder = (langs: readonly string[]): readonly string[] =>
  canonicaliseLocales(
    renderTree(groupTree(langs.map(expandLang).map(makeNode)))
  );
