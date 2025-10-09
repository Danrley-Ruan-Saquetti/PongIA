import { Paddle } from './paddle.js';
import { TableSide } from './types.js';
export class PaddleBot extends Paddle {
    update() {
        super.update();
        this.position.approach({ x: this.position.x, y: this.ball.finalY - (this.height / 2) }, this.speed);
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        else if (this.position.y + this.height > this.tableHeight) {
            this.position.y = this.tableHeight - this.height;
        }
    }
    recalculateDirectionSpeedBall() {
        const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.MAX_SPEED.y * this.ball.MAX_SPEED.y);
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
        this.ball.speed.y = speed * Math.sin(angle) * this.ball.speedMultiplier;
        if (this.side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier;
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier;
        }
    }
}
//# sourceMappingURL=paddle-bot.js.map