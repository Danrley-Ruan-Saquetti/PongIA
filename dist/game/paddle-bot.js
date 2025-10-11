import { Paddle } from './paddle.js';
export class PaddleBot extends Paddle {
    constructor(dimension) {
        super(dimension);
        this.targetType = 'BALL';
        this.typeDirectionBall = 'RANDOM';
    }
    update() {
        super.update();
        let targetY = this.table.position.y;
        if (this.ball.isBallIntoSide(this.side)) {
            targetY = this.targetType == 'BALL' ? this.ball.position.y : this.ball.finalY;
        }
        this.position.approach({ x: this.position.x, y: targetY }, this.speed);
        this.fixPosition();
    }
    setTargetType(type) {
        this.targetType = type;
    }
}
//# sourceMappingURL=paddle-bot.js.map