import { Game } from "../game/game.js";
import { PaddleNN } from './paddle-nn.js';
export class GameNN extends Game {
    getPaddleNeuralNetwork() {
        return this.paddleLeft instanceof PaddleNN ? this.paddleLeft : this.paddleRight;
    }
    setNeuralNetwork(network) {
        this.network = network;
        this.getPaddleNeuralNetwork().network = network;
    }
    getState() {
        return Object.assign(Object.assign({}, super.getState()), { network: this.network, bestSequence: Math.max(this.paddleLeft.statistics.totalRallySequence || 0, this.paddleRight.statistics.totalRallySequence || 0) });
    }
}
//# sourceMappingURL=game-nn.js.map