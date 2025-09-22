import { NeuralNetwork } from './core/neural-network.js';
import { Game } from "../game/game.js";
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
    this.paddleLeft = new PaddleNN(20, this.height / 2 - 50, 15, 100, this.height, 'left', this.ball, this.networkLeft);
    this.paddleRight = new PaddleNN(this.width - 35, this.height / 2 - 50, 15, 100, this.height, 'right', this.ball, this.networkRight);
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
