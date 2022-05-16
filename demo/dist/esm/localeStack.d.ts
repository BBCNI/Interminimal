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
 * @category Classes
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
     * nodes are created by calling `resolve` on existing nodes. In
     * fact you probably don't want to call it at all - use [[`localeRoot`]]
     * instead.
     *
     * @param stack the stack for this node
     * @param parent the parent for this node
     */
    constructor(stack?: readonly string[], parent?: LocaleStack);
    /** @ignore */
    private splice;
    /**
     * Return the node that is the result of prepending a
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
     * @returns a stack node with the prepended langs
     */
    resolve(langs: readonly string[]): LocaleStack;
}
/**
 * A global root node for the locale normalisation stack. Use this in preference
 * to calling `new LocaleStack()`.
 *
 * @category Locale
 */
export declare const localeRoot: LocaleStack;
/**
 * Canonicalise a list of languages.
 *
 * ```typescript
 * console.log(
 *   canonicaliseLocales(["en", "fr", "en", "de", "de", "fr", "cy", "de"]).stack
 * );
 * // ["en", "fr", "de", "cy"]
 * ```
 *
 * Equivalent language lists canonicalise to the same array object and can therefore
 * be used as the key for a `Map` or `Set`.
 *
 * @param langs the list of languages to canonicalise
 * @returns a node for the canonical language stack
 * @category Locale
 */
export declare const canonicaliseLocales: (langs: readonly string[]) => LocaleStack;
