declare type NextReducer<T, U> = (current: T, delta: U) => T;
export declare class NextCache<T extends object, U extends object = T> {
    private readonly cache;
    private factory;
    constructor(factory: NextReducer<T, U>);
    next(current: T, delta: U): T;
}
export {};
