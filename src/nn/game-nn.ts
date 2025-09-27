import { Game } from "../game/game.js";
import { TableSide } from "../game/types.js";
import { NeuralNetwork } from './core/neural-network.js';
import { PaddleNN } from './paddle-nn.js';

export class GameNN extends Game {

  constructor(
    width: number,
    height: number,
    protected networkLeft: NeuralNetwork,
    protected networkRight: NeuralNetwork
  ) {
    super(width, height)
  }

  protected createPaddles() {
    this.paddleLeft = new PaddleNN(15, 100, this.width, this.height, TableSide.LEFT, this.ball, this.networkLeft);
    this.paddleRight = new PaddleNN(15, 100, this.width, this.height, TableSide.RIGHT, this.ball, this.networkRight);
  }

  getState() {
    return {
      ...super.getState(),
      networkLeft: this.networkLeft,
      networkRight: this.networkRight,
      bestFitness: Math.max(this.networkLeft.fitness || 0, this.networkLeft.fitness || 0),
    }
  }
}
