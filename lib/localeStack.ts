// Map incremental locale preferences to canonical locale stack arrays.
// This allows us to rely on reference identity between equivalent locale
// paths.
//
// For example:
//
// const root = new LocaleStack(); // root must be empty
// const ls1 = root.resolve(["en-GB", "en"]);
// const ls2 = ls1.resolve(["cy"]); // ls2 is ["cy", "en-GB", "en"]
// const ls3 = ls2.resolve(["en"]); // ls3 is ["en", "cy", "en-GB"]
// const ls4 = root.resolve(["en", "cy", "en-GB"]) // ls4 is ["en", "cy", "en-GB"]
// expect(ls4).toBe(ls3); // same thing!
//
// Reference identity means we can index into cache Maps based on locale stacks
// and trust that any given sequence of locales, however arrived at, will resolve
// to the same LocaleStack.

export class LocaleStack {
  private readonly next: { [key: string]: LocaleStack } = {};
  private readonly parent?: LocaleStack;
  public readonly stack: readonly string[];

  constructor(stack: readonly string[] = [], parent?: LocaleStack) {
    if (stack.length && !parent)
      throw new Error(`Root LocaleStack can't have a stack`);
    this.stack = Object.freeze(stack);
    this.parent = parent;
  }

  // Return a node whose stack has lang moved to its head, removing
  // a prior instance of lang. Fails if there's no prior instance of
  // lang in the stack.
  private splice(lang: string, path: string[]): LocaleStack {
    // istanbul ignore next - guarded by condition in constructor
    if (!this.parent) throw new Error(`No parent. Shouldn't happen.`);

    // We've found the previous instance of lang in the stack so
    // splice the accumulated path onto our parent (i.e. just above
    // the previous instance of lang)
    if (lang === this.stack[0]) return this.parent.resolve([lang, ...path]);

    // Ask our parent to do the splice with our primary language
    // appended to the path. Thus when lang is found the ancestor
    // that finds it can reconstitute the path from below lang
    return this.parent.splice(lang, path.concat(this.stack[0]));
  }

  resolve(langs: string[]): LocaleStack {
    if (!langs.length) return this; // we've arrived

    const tail = [...langs];
    const lang = tail.pop() as string;

    const nextNode = (this.next[lang] =
      this.next[lang] ||
      (this.stack.includes(lang)
        ? this.splice(lang, [])
        : new LocaleStack([lang].concat(this.stack), this)));

    return nextNode.resolve(tail);
  }
}
