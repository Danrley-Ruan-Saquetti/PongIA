export class ObjectPool {
    constructor(size = 10, factory, reset) {
        this.factory = factory;
        this.reset = reset;
        this.pool = [];
        this.used = new Set();
        this.size = 0;
        this.increaseSize(size);
    }
    increaseSize(amount) {
        this.size += amount;
        for (let i = 0; i < amount; i++) {
            this.pool.push(this.factory());
        }
    }
    acquire() {
        if (this.pool.length === 0) {
            throw new Error("Pool is empty");
        }
        const element = this.pool.pop();
        this.used.add(element);
        return element;
    }
    release(element) {
        if (!this.used.has(element)) {
            throw new Error("This object does not belong to this pool");
        }
        this.reset(element);
        this.used.delete(element);
        this.pool.push(element);
    }
    available() {
        return this.pool.length;
    }
    inUse() {
        return this.used.size;
    }
}
//# sourceMappingURL=object-pool.js.map