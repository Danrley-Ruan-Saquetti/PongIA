export type Factory<T> = () => T
export type Reset<T> = (element: T) => void

export class ObjectPool<T> {

  private pool: T[] = []
  private used: Set<T> = new Set()

  constructor(
    private maxSize: number = 10,
    private factory: Factory<T>,
    private reset: Reset<T>
  ) {
    for (let i = 0; i < maxSize; i++) {
      this.pool.push(factory())
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
