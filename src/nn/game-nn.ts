import { Game } from "../game/game.js"
import { NeuralNetwork } from './core/neural-network.js'
import { PaddleNN } from './paddle-nn.js'

export class GameNN extends Game {

  protected network: NeuralNetwork

  getPaddleNeuralNetwork() {
    return this.paddleLeft instanceof PaddleNN ? this.paddleLeft : this.paddleRight as PaddleNN
  }

  setNeuralNetwork(network: NeuralNetwork) {
    this.network = network

    this.getPaddleNeuralNetwork().network = network
  }

  getState() {
    return {
      ...super.getState(),
      network: this.network,
      bestSequence: Math.max(this.paddleLeft.accStatistics.totalRallySequence || 0, this.paddleRight.accStatistics.totalRallySequence || 0),
    }
  }
}
