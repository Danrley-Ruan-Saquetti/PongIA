export class Vector2D {

  constructor(
    public x = 0,
    public y = 0
  ) { }

  approach(target: { x: number, y: number }, delta: number) {
    if (Math.abs(target.x - this.x) <= delta) {
      this.x = target.x;
    } else {
      this.x += (target.x > this.x ? 1 : -1) * delta;
    }

    if (Math.abs(target.y - this.y) <= delta) {
      this.y = target.y;
    } else {
      this.y += (target.y > this.y ? 1 : -1) * delta;
    }
  }
}
