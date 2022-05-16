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
export declare class LocaleStack {
    /** @ignore */
    private readonly next;
    /** @ignore */
    private readonly parent?;
    /**
     * A read only array of locale tags. All equivalent locale stacks
     * refer to the same array.
     */
    readonly stack: readonly string[];
    /**
     * Normally only called directly to create a new root node. Other
     * nodes are created by calling `resolve` on existing nodes.
     *
     * @param stack the stack for this node
     * @param parent the parent for this node
     */
    constructor(stack?: readonly string[], parent?: LocaleStack);
    /** @ignore */
    private splice;
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
    resolve(langs: string[]): LocaleStack;
}
export declare const localeRoot: LocaleStack;
export declare const canonicaliseLocales: (langs: string[]) => LocaleStack;
