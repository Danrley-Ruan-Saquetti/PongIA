import { Paddle } from "../game/paddle.js";
export class PaddleNN extends Paddle {
    constructor(width, height, tableWidth, tableHeight, side) {
        super(width, height, tableWidth, tableHeight, side);
    }
    update() {
        const [up, down, stay] = this.network.feedforward([
            this.position.y,
            this.ball.position.x,
            this.ball.position.y,
            this.ball.speed.x,
            this.ball.speed.y,
        ]);
        if (up > down && up > stay) {
            this.moveUp();
        }
        else if (down > up && down > stay) {
            this.moveDown();
        }
    }
}
//# sourceMappingURL=paddle-nn.js.map