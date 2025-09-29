import { Game } from "../game/game.js";
import { PaddleNN } from './paddle-nn.js';
export class GameNN extends Game {
    getPaddleLeft() {
        return this.paddleLeft;
    }
    getPaddleRight() {
        return this.paddleRight;
    }
    setNeuralNetworkLeft(network) {
        this.networkLeft = network;
        if (this.paddleLeft instanceof PaddleNN) {
            this.paddleLeft.network = network;
        }
    }
    setNeuralNetworkRight(network) {
        this.networkRight = network;
        if (this.paddleRight instanceof PaddleNN) {
            this.paddleRight.network = network;
        }
    }
    getState() {
        return Object.assign(Object.assign({}, super.getState()), { networkLeft: this.networkLeft, networkRight: this.networkRight, bestSequence: Math.max(this.paddleLeft.statistics.totalRallySequence || 0, this.paddleRight.statistics.totalRallySequence || 0) });
    }
}
//# sourceMappingURL=game-nn.js.map