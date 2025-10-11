import { Paddle } from './paddle.js'
import { TableSide } from './types.js'

export class PaddleBot extends Paddle {

  constructor(
    width: number,
    height: number,
    tableWidth: number,
    tableHeight: number,
    side: TableSide,
  ) {
    super(width, height, tableWidth, tableHeight, side)

    this.typeDirectionBall = 'RANDOM'
  }

  update() {
    super.update()

    this.position.approach({ x: this.position.x, y: this.ball.finalY - (this.height / 2) }, this.speed)

    if (this.position.y < 0) {
      this.position.y = 0
    } else if (this.position.y + this.height > this.tableHeight) {
      this.position.y = this.tableHeight - this.height
    }
  }
}
