import { Paddle } from "../game/paddle.js"
import { TableSide } from "../game/types.js"
import { Dimension } from "../utils/dimension.js"
import { NeuralNetwork } from "./core/neural-network.js"

export class PaddleNN extends Paddle {

  network: NeuralNetwork

  private readonly ACTION = {
    1: () => this.moveDown(),
    2: () => this.moveUp(),
  }

  constructor(
    dimension: Dimension,
    side: TableSide
  ) {
    super(dimension, side)

    this.color = 'yellow'
  }

  update() {
    super.update()

    const outputs = this.network.feedforward(this.getInputNormalized())

    const actionIndex = this.chooseActionProbabilistic(outputs, .7) as keyof typeof this.ACTION

    const action = this.ACTION[actionIndex]

    action && action()
  }

  protected getInputNormalized() {
    return [
      ((this.position.y - this.table.positionInitialY) / this.table.dimension.height) * 2 - 1,
      ((this.ball.position.x - this.table.positionInitialX) / this.table.dimension.width) * 2 - 1,
      ((this.ball.position.y - this.table.positionInitialY) / this.table.dimension.height) * 2 - 1,
      this.ball.speed.x / this.ball.MAX_SPEED.x * this.ball.MAX_MULTIPLIER,
      this.ball.speed.y / this.ball.MAX_SPEED.y * this.ball.MAX_MULTIPLIER
    ]
  }

  protected chooseActionProbabilistic(outputs: number[], temperature = 1) {
    const probs = this.softmax(outputs, temperature)
    const chosen = Math.random()

    for (let i = 0, acc = probs[i]; i < probs.length; i++, acc += probs[i]) {
      if (chosen <= acc) {
        return i
      }
    }

    return probs.length - 1
  }

  protected softmax(xs: number[], temperature = 1) {
    const t = Math.max(1e-8, temperature)
    const scaled = xs.map(v => v / t)
    const m = Math.max(...scaled)
    const exps = scaled.map(v => Math.exp(v - m))
    const s = exps.reduce((a, b) => a + b, 0)

    return exps.map(e => e / s)
  }
}
