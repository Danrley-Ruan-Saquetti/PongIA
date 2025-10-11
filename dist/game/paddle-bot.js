import { Paddle } from './paddle.js';
export class PaddleBot extends Paddle {
    constructor(width, height, tableWidth, tableHeight, side) {
        super(width, height, tableWidth, tableHeight, side);
        this.targetType = 'BALL';
        this.typeDirectionBall = 'RANDOM';
    }
    update() {
        super.update();
        let targetY = (this.tableHeight / 2);
        if (this.ball.isBallIntoSide(this.side)) {
            targetY = this.targetType == 'BALL' ? this.ball.position.y : this.ball.finalY;
        }
        this.position.approach({ x: this.position.x, y: targetY - (this.height / 2) }, this.speed);
        this.fixPosition();
    }
}
//# sourceMappingURL=paddle-bot.js.map