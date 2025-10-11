import { Paddle } from './paddle.js'
import { TableSide } from './types.js'

export class PaddleBot extends Paddle {

  targetType: 'BALL' | 'FINAL' = 'BALL'

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

    let targetY = (this.tableHeight / 2)

    if (this.ball.isBallIntoSide(this.side)) {
      targetY = this.targetType == 'BALL' ? this.ball.position.y : this.ball.finalY
    }

    this.position.approach({ x: this.position.x, y: targetY - (this.height / 2) }, this.speed)

    this.fixPosition()
  }
}
