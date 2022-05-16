/**
 * Map incremental locale preferences to canonical locale stack arrays.
 * This allows us to rely on reference identity between equivalent locale
 * paths.
 *
 * For example:
 *
 * ```typescript
 * const root = new LocaleStack(); // root must be empty
 * const ls1 = root.resolve(["en-GB", "en"]);
 * const ls2 = ls1.resolve(["cy"]); // ls2 is ["cy", "en-GB", "en"]
 * const ls3 = ls2.resolve(["en"]); // ls3 is ["en", "cy", "en-GB"]
 * const ls4 = root.resolve(["en", "cy", "en-GB"]) // ls4 is ["en", "cy", "en-GB"]
 * expect(ls4).toBe(ls3); // same thing!
 * ```
 *
 * Reference identity means we can index into cache Maps based on locale stacks
 * and trust that any given sequence of locales, however arrived at, will resolve
 * to the same LocaleStack.
 */
export class LocaleStack {
  /** @ignore */
  private readonly next: { [key: string]: LocaleStack } = {};
  /** @ignore */
  private readonly parent?: LocaleStack;
  /**
   * A read only array of locale tags. All equivalent locale stacks
   * refer to the same array.
   */
  public readonly stack: readonly string[];

  /**
   * Normally only called directly to create a new root node. Other
   * nodes are created by calling `resolve` on existing nodes.
   *
   * @param stack the stack for this node
   * @param parent the parent for this node
   */
  constructor(stack: readonly string[] = [], parent?: LocaleStack) {
    if (stack.length && !parent)
      throw new Error(`Root LocaleStack can't have a stack`);
    this.stack = Object.freeze(stack);
    this.parent = parent;
  }

  // Return a node whose stack has lang moved to its head, removing
  // a prior instance of lang. Fails if there's no prior instance of
  // lang in the stack.
  /** @ignore */
  private splice(lang: string, path: string[]): LocaleStack {
    // istanbul ignore next - guarded by condition in constructor
    if (!this.parent) throw new Error(`No parent. Shouldn't happen.`);

    // We've found the previous instance of lang in the stack so
    // splice the accumulated path onto our parent (i.e. just above
    // the previous instance of lang)
    if (lang === this.stack[0]) return this.parent.resolve([lang, ...path]);

    // Ask our parent to do the splice with our primary language
    // appended to the path. Thus when lang is found the ancestor
    // that finds it can reconstitute the path from above lang
    return this.parent.splice(lang, path.concat(this.stack[0]));
  }

  /**
   * Return the `LocalStack` node which is the result of prepending a
   * (possibly empty) list of locales to this node.
   *
   * ```typescript
   * const ls1 = localeRoot.resolve(["en", "fr"]);
   * const ls2 = ls1.resolve(["fr"]); // now ["fr", "en"]
   * const ls3 = localeRoot.resolve(["fr", "en"]); // also ["fr", "en"]
   * if (ls2 === ls3) console.log("Same thing!");
   * ```
   *
   * @param langs a list of langs to prepend to the stack
   * @returns a `LocaleStack` with the prepended langs
   */
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

export const localeRoot = new LocaleStack();

export const canonicaliseLocales = (langs: string[]) =>
  localeRoot.resolve(langs);
