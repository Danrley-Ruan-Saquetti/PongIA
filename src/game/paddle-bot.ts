import { Dimension } from '../utils/dimension.js'
import { Paddle } from './paddle.js'
import { TableSide } from './types.js'

export type PaddleBotTargetType = 'BALL' | 'FINAL'

export class PaddleBot extends Paddle {

  private targetType: PaddleBotTargetType = 'BALL'

  constructor(
    dimension: Dimension,
    side: TableSide,
  ) {
    super(dimension, side)

    this.typeDirectionBall = 'RANDOM'
  }

  update() {
    super.update()

    let targetY = (this.table.dimension.height / 2)

    if (this.ball.isBallIntoSide(this.side)) {
      targetY = this.targetType == 'BALL' ? this.ball.position.y : this.ball.finalY
    }

    this.position.approach({ x: this.position.x, y: targetY - (this.dimension.height / 2) }, this.speed)

    this.fixPosition()
  }

  setTargetType(type: PaddleBotTargetType) {
    this.targetType = type
  }
}
