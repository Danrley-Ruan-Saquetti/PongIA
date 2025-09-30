import { Paddle } from './paddle.js';
import { TableSide } from './types.js';
export class PaddleBot extends Paddle {
    update() {
        super.update();
        this.position.approach({ x: this.position.x, y: this.ball.position.y - (this.height / 2) }, this.speed);
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        else if (this.position.y + this.height > this.tableHeight) {
            this.position.y = this.tableHeight - this.height;
        }
    }
    recalculateDirectionSpeedBall() {
        const speed = Math.sqrt(this.ball.speed.x * this.ball.speed.x + this.ball.speed.y * this.ball.speed.y);
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
        this.ball.speed.y = speed * Math.sin(angle);
        if (this.side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(angle));
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(angle));
        }
    }
}
//# sourceMappingURL=paddle-bot.js.map