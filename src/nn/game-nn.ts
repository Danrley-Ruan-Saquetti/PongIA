import { Game } from "../game/game.js"
import { NeuralNetwork } from './core/neural-network.js'
import { PaddleNN } from './paddle-nn.js'

export class GameNN extends Game {

  protected networkLeft: NeuralNetwork
  protected networkRight: NeuralNetwork

  getPaddleLeft() {
    return this.paddleLeft as PaddleNN
  }

  getPaddleRight() {
    return this.paddleRight as PaddleNN
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
      bestSequence: Math.max(this.paddleLeft.statistics.totalRallySequence || 0, this.paddleRight.statistics.totalRallySequence || 0),
    }
  }
}
