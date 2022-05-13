export class LocaleStack {
  private readonly next: { [key: string]: LocaleStack } = {};
  private readonly parent?: LocaleStack;
  public readonly stack: readonly string[];

  constructor(stack: readonly string[] = [], parent?: LocaleStack) {
    if (stack.length && !parent)
      throw new Error(`Root LocaleStack can't have a stack`);
    this.stack = stack;
    this.parent = parent;
  }

  private splice(lang: string, path: string[]): LocaleStack {
    // istanbul ignore next - guarded by condition in constructor
    if (!this.parent) throw new Error(`No parent. Shouldn't happen.`);
    if (lang === this.stack[0]) return this.parent.resolve([lang, ...path]);
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
