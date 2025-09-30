export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    approach(target, delta) {
        if (Math.abs(target.x - this.x) <= delta) {
            this.x = target.x;
        }
        else {
            this.x += (target.x > this.x ? 1 : -1) * delta;
        }
        if (Math.abs(target.y - this.y) <= delta) {
            this.y = target.y;
        }
        else {
            this.y += (target.y > this.y ? 1 : -1) * delta;
        }
    }
}
//# sourceMappingURL=vector2d.js.map