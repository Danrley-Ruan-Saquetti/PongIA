import { Game } from "../game/game.js";
import { PaddleNN } from './paddle-nn.js';
export class GameNN extends Game {
    getPaddleNeuralNetwork() {
        return this._paddleLeft instanceof PaddleNN ? this._paddleLeft : this._paddleRight;
    }
    setNeuralNetwork(network) {
        this.network = network;
        this.getPaddleNeuralNetwork().network = network;
    }
    getBestSequence() {
        return Math.max(this._paddleLeft.accStatistics.totalRallySequence || 0, this._paddleRight.accStatistics.totalRallySequence || 0);
    }
}
//# sourceMappingURL=game-nn.js.map