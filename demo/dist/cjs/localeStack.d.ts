export declare class LocaleStack {
    private readonly next;
    private readonly parent?;
    readonly stack: readonly string[];
    constructor(stack?: readonly string[], parent?: LocaleStack);
    private splice;
    resolve(langs: string[]): LocaleStack;
}
