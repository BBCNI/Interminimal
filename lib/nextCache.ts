export type NextFactory<T, U> = (current: T, delta: U) => T;

export class NextCache<T extends object, U extends object> {
  private readonly cache = new WeakMap<T, WeakMap<U, T>>();
  private factory: NextFactory<T, U>;

  constructor(factory: NextFactory<T, U>) {
    this.factory = factory;
  }

  next(current: T, delta: U): T {
    let slot = this.cache.get(current);
    if (!slot) this.cache.set(current, (slot = new WeakMap<U, T>()));
    let next = slot.get(delta);
    if (!next) slot.set(delta, (next = this.factory(current, delta)));
    return next;
  }
}
