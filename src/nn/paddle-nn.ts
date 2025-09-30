import { Paddle } from "../game/paddle.js"
import { TableSide } from "../game/types.js"
import { NeuralNetwork } from "./core/neural-network.js"

export class PaddleNN extends Paddle {

  network: NeuralNetwork

  constructor(
    width: number,
    height: number,
    tableWidth: number,
    tableHeight: number,
    side: TableSide,
  ) {
    super(width, height, tableWidth, tableHeight, side)

    this.color = 'yellow'
  }

  update() {
    const [up, down, stay] = this.network.feedforward([
      this.position.y,
      this.ball.position.x,
      this.ball.position.y,
      this.ball.speed.x,
      this.ball.speed.y,
    ])

    if (up > down && up > stay) {
      this.moveUp()
    }
    else if (down > up && down > stay) {
      this.moveDown()
    }
  }
}
