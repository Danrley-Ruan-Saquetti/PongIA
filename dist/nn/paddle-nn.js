import { Paddle } from "../game/paddle.js";
export class PaddleNN extends Paddle {
    constructor(width, height, tableWidth, tableHeight, side) {
        super(width, height, tableWidth, tableHeight, side);
        this.color = 'yellow';
    }
    update() {
        super.update();
        const [up, down, stay] = this.network.feedforward(this.getInputNormalized());
        if (up > down && up > stay) {
            this.moveUp();
        }
        else if (down > up && down > stay) {
            this.moveDown();
        }
    }
    getInputNormalized() {
        return [
            ((this.position.y + this.height / 2) / this.tableHeight) * 2 - 1,
            (this.ball.position.x / this.tableWidth) * 2 - 1,
            (this.ball.position.y / this.tableHeight) * 2 - 1,
            this.ball.speed.x / this.ball.MAX_SPEED.x * this.ball.MAX_MULTIPLIER,
            this.ball.speed.y / this.ball.MAX_SPEED.y * this.ball.MAX_MULTIPLIER
        ];
    }
}
//# sourceMappingURL=paddle-nn.js.map