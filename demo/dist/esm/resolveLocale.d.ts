import "./weakRef";
export declare type LocaleStack = readonly string[];
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
export declare const resolveLocales: (stack: LocaleStack, langs: LocaleStack) => LocaleStack;
/**
 * A global empty locale stack which equals [].
 *
 * @category Locale
 */
export declare const localeRoot: LocaleStack;
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
export declare const canonicaliseLocales: (stack: LocaleStack) => LocaleStack;
