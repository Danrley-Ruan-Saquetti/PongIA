import { Ball } from "../game/ball.js"
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
    ball: Ball
  ) {
    super(width, height, tableWidth, tableHeight, side, ball)
  }

  update() {
    const [up, down, stay] = this.network.feedforward([
      this.position.y,
      this.ball.position.x,
      this.ball.position.y,
      Math.abs(this.ball.speed.x),
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
