import { Dimension } from '../utils/dimension.js'
import { Paddle } from './paddle.js'

export type PaddleBotTargetType = 'BALL' | 'FINAL'

export class PaddleBot extends Paddle {

  private targetType: PaddleBotTargetType = 'BALL'

  constructor(dimension: Dimension) {
    super(dimension)

    this.typeDirectionBall = 'RANDOM'
  }

  update() {
    super.update()

    let targetY = this.table.position.y

    if (this.ball.isBallIntoSide(this.side)) {
      targetY = this.targetType == 'BALL' ? this.ball.position.y : this.ball.finalY
    }

    this.position.approach({ x: this.position.x, y: targetY }, this.speed)

    this.fixPosition()
  }

  setTargetType(type: PaddleBotTargetType) {
    this.targetType = type
  }
}
