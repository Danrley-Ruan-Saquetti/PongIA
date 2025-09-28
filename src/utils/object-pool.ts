export type Factory<T> = () => T
export type Reset<T> = (element: T) => void

export class ObjectPool<T> {

  private pool: T[] = []
  private used: Set<T> = new Set()

  private size = 0

  constructor(
    size = 10,
    private factory: Factory<T>,
    private reset: Reset<T>
  ) {
    this.increaseSize(size)
  }

  increaseSize(amount: number) {
    this.size += amount

    for (let i = 0; i < amount; i++) {
      this.pool.push(this.factory())
    }
  }

  acquire() {
    if (this.pool.length === 0) {
      throw new Error("Pool is empty")
    }

    const element = this.pool.pop() as T

    this.used.add(element)

    return element
  }

  release(element: T) {
    if (!this.used.has(element)) {
      throw new Error("This object does not belong to this pool")
    }

    this.reset(element)
    this.used.delete(element)
    this.pool.push(element)
  }

  available() {
    return this.pool.length
  }

  inUse() {
    return this.used.size
  }
}
