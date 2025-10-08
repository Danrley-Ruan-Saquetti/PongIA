export class DeltaTime {

  private _lastElapsedTimeMilliseconds = 0
  private _elapsedTimeMilliseconds = 0
  private _totalElapsedTimeMilliseconds = 0

  get lastElapsedTimeMilliseconds() { return this._lastElapsedTimeMilliseconds }
  get elapsedTimeMilliseconds() { return this._elapsedTimeMilliseconds }
  get elapsedTimeSeconds() { return this._elapsedTimeMilliseconds / 1_000 }
  get totalElapsedTimeMilliseconds() { return this._totalElapsedTimeMilliseconds }
  get totalElapsedTimeSeconds() { return this._totalElapsedTimeMilliseconds / 1_000 }

  get FPS() {
    const deltaTimeSeconds = this.elapsedTimeSeconds
    return deltaTimeSeconds > 0 ? Math.round(1 / deltaTimeSeconds) : 0
  }

  constructor(private multiplier = 1) {
    this.reset()
  }

  reset() {
    this._lastElapsedTimeMilliseconds = this.performanceNow()
    this._elapsedTimeMilliseconds = 0
    this._totalElapsedTimeMilliseconds = 0
  }

  next() {
    const current = this.performanceNow()

    this._elapsedTimeMilliseconds = current - this._lastElapsedTimeMilliseconds
    this._totalElapsedTimeMilliseconds += this._elapsedTimeMilliseconds
    this._lastElapsedTimeMilliseconds = current
  }

  performanceNow() {
    return performance.now() * this.multiplier
  }

  setMultiplier(multiplier: number) {
    this.multiplier = multiplier
  }

  toJSON() {
    return {
      lastElapsedTimeMilliseconds: this.lastElapsedTimeMilliseconds,
      elapsedTimeMilliseconds: this.elapsedTimeMilliseconds,
      elapsedTimeSeconds: this.elapsedTimeSeconds,
      totalElapsedTimeMilliseconds: this.totalElapsedTimeMilliseconds,
      totalElapsedTimeSeconds: this.totalElapsedTimeSeconds,
    }
  }
}
