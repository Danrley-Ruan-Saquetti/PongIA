import { Game } from "../game/game.js";
import { TableSide } from "../game/types.js";
import { PaddleNN } from './paddle-nn.js';
export class GameNN extends Game {
    getPaddleNeuralNetwork() {
        return this.paddles[TableSide.LEFT] instanceof PaddleNN ? this.paddles[TableSide.LEFT] : this.paddles[TableSide.RIGHT];
    }
    setNeuralNetwork(network) {
        this.network = network;
        this.getPaddleNeuralNetwork().network = network;
    }
    getBestSequence() {
        return Math.max(this.paddles[TableSide.LEFT].accStatistics.totalRallySequence || 0, this.paddles[TableSide.RIGHT].accStatistics.totalRallySequence || 0);
    }
}
//# sourceMappingURL=game-nn.js.map