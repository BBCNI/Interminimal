export declare type NextFactory<T, U> = (current: T, delta: U) => T;
export declare class NextCache<T extends object, U extends object> {
    private readonly cache;
    private factory;
    constructor(factory: NextFactory<T, U>);
    next(current: T, delta: U): T;
}
