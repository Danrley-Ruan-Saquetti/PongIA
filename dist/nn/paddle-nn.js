import { Paddle } from "../game/paddle.js";
export class PaddleNN extends Paddle {
    constructor() {
        super();
        this.ACTION = {
            1: () => this.moveDown(),
            2: () => this.moveUp(),
        };
        this.color = 'yellow';
    }
    update() {
        super.update();
        const outputs = this.network.feedforward(this.getInputNormalized());
        const actionIndex = this.chooseActionProbabilistic(outputs, .7);
        const action = this.ACTION[actionIndex];
        action && action();
    }
    getInputNormalized() {
        return [
            ((this.position.y - this.table.positionInitialY) / this.table.dimension.height) * 2 - 1,
            ((this.ball.position.x - this.table.positionInitialX) / this.table.dimension.width) * 2 - 1,
            ((this.ball.position.y - this.table.positionInitialY) / this.table.dimension.height) * 2 - 1,
            this.ball.speed.x / this.ball.MAX_SPEED.x * this.ball.MAX_MULTIPLIER,
            this.ball.speed.y / this.ball.MAX_SPEED.y * this.ball.MAX_MULTIPLIER
        ];
    }
    chooseActionProbabilistic(outputs, temperature = 1) {
        const probs = this.softmax(outputs, temperature);
        const chosen = Math.random();
        for (let i = 0, acc = probs[i]; i < probs.length; i++, acc += probs[i]) {
            if (chosen <= acc) {
                return i;
            }
        }
        return probs.length - 1;
    }
    softmax(xs, temperature = 1) {
        const t = Math.max(1e-8, temperature);
        const scaled = xs.map(v => v / t);
        const m = Math.max(...scaled);
        const exps = scaled.map(v => Math.exp(v - m));
        const s = exps.reduce((a, b) => a + b, 0);
        return exps.map(e => e / s);
    }
}
//# sourceMappingURL=paddle-nn.js.map