import { Game } from "../game/game.js"
import { TableSide } from "../game/types.js"
import { NeuralNetwork } from './core/neural-network.js'
import { PaddleNN } from './paddle-nn.js'

export class GameNN extends Game {

  protected network: NeuralNetwork

  getPaddleNeuralNetwork() {
    return this.paddles[TableSide.LEFT] instanceof PaddleNN ? this.paddles[TableSide.LEFT] : this.paddles[TableSide.RIGHT] as PaddleNN
  }

  setNeuralNetwork(network: NeuralNetwork) {
    this.network = network

    this.getPaddleNeuralNetwork().network = network
  }

  getBestSequence() {
    return Math.max(this.paddles[TableSide.LEFT].accStatistics.totalRallySequence || 0, this.paddles[TableSide.RIGHT].accStatistics.totalRallySequence || 0)
  }
}
