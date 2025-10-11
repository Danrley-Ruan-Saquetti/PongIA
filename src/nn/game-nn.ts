import { Game } from "../game/game.js"
import { NeuralNetwork } from './core/neural-network.js'
import { PaddleNN } from './paddle-nn.js'

export class GameNN extends Game {

  protected network: NeuralNetwork

  getPaddleNeuralNetwork() {
    return this._paddleLeft instanceof PaddleNN ? this._paddleLeft : this._paddleRight as PaddleNN
  }

  setNeuralNetwork(network: NeuralNetwork) {
    this.network = network

    this.getPaddleNeuralNetwork().network = network
  }

  getBestSequence() {
    return Math.max(this._paddleLeft.accStatistics.totalRallySequence || 0, this._paddleRight.accStatistics.totalRallySequence || 0)
  }
}
