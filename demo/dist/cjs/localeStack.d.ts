export declare class LocaleStack {
    private readonly next;
    private readonly parent?;
    readonly stack: readonly string[];
    constructor(stack?: readonly string[], parent?: LocaleStack);
    private splice;
    resolve(langs: string[]): LocaleStack;
}
export declare const localeRoot: LocaleStack;
export declare const canonicaliseLocales: (langs: string[]) => LocaleStack;
