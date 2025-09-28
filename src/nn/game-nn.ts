import { Game } from "../game/game.js"
import { TableSide } from "../game/types.js"
import { NeuralNetwork } from './core/neural-network.js'
import { PaddleNN } from './paddle-nn.js'

export class GameNN extends Game {

  protected networkLeft: NeuralNetwork
  protected networkRight: NeuralNetwork

  constructor(
    width: number,
    height: number,
  ) {
    super(width, height)
  }

  protected loadPaddles() {
    this.paddleLeft = new PaddleNN(10, 100, this.width, this.height, TableSide.LEFT, this.ball)
    this.paddleRight = new PaddleNN(10, 100, this.width, this.height, TableSide.RIGHT, this.ball)
  }

  setNeuralNetworkLeft(network: NeuralNetwork) {
    this.networkLeft = network
    if (this.paddleLeft instanceof PaddleNN) {
      this.paddleLeft.network = network
    }
  }

  setNeuralNetworkRight(network: NeuralNetwork) {
    this.networkRight = network
    if (this.paddleRight instanceof PaddleNN) {
      this.paddleRight.network = network
    }
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
