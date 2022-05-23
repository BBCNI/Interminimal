"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextCache = void 0;
var NextCache = /** @class */ (function () {
    function NextCache(factory) {
        this.cache = new WeakMap();
        this.factory = factory;
    }
    NextCache.prototype.next = function (current, delta) {
        var slot = this.cache.get(current);
        if (!slot)
            this.cache.set(current, (slot = new WeakMap()));
        var next = slot.get(delta);
        if (!next)
            slot.set(delta, (next = this.factory(current, delta)));
        return next;
    };
    return NextCache;
}());
exports.NextCache = NextCache;
