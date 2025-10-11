import { Dimension } from "../utils/dimension.js"
import { Ball } from "./ball.js"
import { GameEntity } from "./game-entity.js"
import { Table } from './table'
import { TableSide } from "./types.js"

export type PaddleStatistics = {
  countRounds: number
  roundVictories: number
  score: number
  ballsLost: number
  scoresByAttack: number
  rallySequence: number
  rallyInitiated: number
  longestRallySequence: number
  totalRallySequence: number
  anticipationTimes: number
}

export type PaddleTypeDirectionBall = 'RANDOM' | 'ANGLE'

export class Paddle extends GameEntity {

  protected table: Table
  protected ball: Ball

  statistics: PaddleStatistics = Paddle.getDefaultStatistics()
  accStatistics: PaddleStatistics = Paddle.getDefaultStatistics()

  color = 'white'
  readonly speed = 6

  protected typeDirectionBall: PaddleTypeDirectionBall = 'ANGLE'

  protected isMoveForAttack = false
  protected isCounteredBall = false
  protected isAnticipated = false
  protected inSequence = false

  constructor(
    public readonly dimension: Dimension,
    public readonly side: TableSide,
  ) {
    super()
  }

  private static getDefaultStatistics(): PaddleStatistics {
    return {
      countRounds: 0,
      roundVictories: 0,
      score: 0,
      ballsLost: 0,
      scoresByAttack: 0,
      rallySequence: 0,
      rallyInitiated: 0,
      longestRallySequence: 0,
      totalRallySequence: 0,
      anticipationTimes: 0,
    }
  }

  onStartGame() {
    if (this.side == TableSide.LEFT) {
      this.position.x = 20
    } else {
      this.position.x = this.table.dimension.width - this.dimension.width - 30
    }

    this.accStatistics = Paddle.getDefaultStatistics()
    this.statistics = Paddle.getDefaultStatistics()
  }

  onStartRound() {
    this.accStatistics.score += this.statistics.score
    this.accStatistics.ballsLost += this.statistics.ballsLost
    this.accStatistics.scoresByAttack += this.statistics.scoresByAttack
    this.accStatistics.rallySequence += this.statistics.rallySequence
    this.accStatistics.rallyInitiated += this.statistics.rallyInitiated
    this.accStatistics.longestRallySequence += this.statistics.longestRallySequence
    this.accStatistics.totalRallySequence += this.statistics.totalRallySequence
    this.accStatistics.anticipationTimes += this.statistics.anticipationTimes

    this.accStatistics.countRounds++

    this.statistics = Paddle.getDefaultStatistics()

    this.reset()
  }

  reset() {
    this.position.y = (this.table.dimension.height / 2) - (this.dimension.height / 2)

    this.isMoveForAttack = false
    this.isCounteredBall = false
    this.isAnticipated = false
    this.inSequence = false
  }

  update() { }

  protected fixPosition() {
    if (this.position.y < 0) {
      this.position.y = 0
    } else if (this.position.y + this.dimension.height > this.table.dimension.height) {
      this.position.y = this.table.dimension.height - this.dimension.height
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height)

    ctx.textAlign = "center"
    ctx.font = "20px Arial"
    ctx.fillStyle = 'white'

    ctx.fillText(
      `Sequence: ${this.statistics.rallySequence}`,
      this.position.x + (this.side == TableSide.LEFT ? 150 : -150),
      this.table.dimension.height - 15
    )
  }

  moveUp() {
    this.position.y -= this.speed

    if (this.position.y >= 0) {
      this.onMoved()
    }

    this.fixPosition()
  }

  moveDown() {
    this.position.y += this.speed

    if (this.position.y + this.dimension.height <= this.table.dimension.height) {
      this.onMoved()
    }

    this.fixPosition()
  }

  onMoved() {
    this.isMoveForAttack = true

    if (!this.ball.isBallIntoSide(this.side)) {
      return
    }

    if (this.position.y <= this.ball.finalY && this.ball.finalY <= this.position.y + this.dimension.height) {
      if (!this.ball.isCrossedTable()) {
        this.isAnticipated = true
      }
    } else if (this.ball.isCrossedTable()) {
      this.isAnticipated = false
    }
  }

  onVictory() {
    this.accStatistics.roundVictories++
  }

  onScore() {
    this.statistics.score++

    if (this.isCounteredBall) {
      this.statistics.scoresByAttack++
    }

    this.isAnticipated = false
    this.isCounteredBall = false
    this.isMoveForAttack = false

    this.stopRally()
  }

  onLostBall() {
    this.statistics.ballsLost++

    this.isMoveForAttack = false
    this.isCounteredBall = false
    this.isAnticipated = false

    this.stopRally()
  }

  onBallHit() {
    this.isCounteredBall = this.isMoveForAttack

    if (this.isAnticipated) {
      this.statistics.anticipationTimes++
    }

    this.nextRally()
    this.recalculateDirectionSpeedBall()
  }

  protected recalculateDirectionSpeedBall() {
    if (this.typeDirectionBall == 'ANGLE') {
      this.calculateDirectionSpeedBallFromAngle()
    } else {
      this.calculateRandomDirectionSpeedBall()
    }
  }

  protected calculateDirectionSpeedBallFromAngle() {
    const relativeIntersectY = this.ball.position.y - (this.position.y + this.dimension.height / 2)
    const normalizedIntersectY = relativeIntersectY / (this.dimension.height / 2)
    const maxBounceAngle = Math.PI / 3
    const bounceAngle = normalizedIntersectY * maxBounceAngle

    const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.speed.y * this.ball.speed.y)

    this.ball.speed.y = speed * Math.sin(bounceAngle) * this.ball.speedMultiplier

    if (this.side === TableSide.LEFT) {
      this.ball.speed.x = Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier
    } else {
      this.ball.speed.x = -Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier
    }
  }

  protected calculateRandomDirectionSpeedBall() {
    const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.MAX_SPEED.y * this.ball.MAX_SPEED.y)

    const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4)

    this.ball.speed.y = speed * Math.sin(angle) * this.ball.speedMultiplier

    if (this.side === TableSide.LEFT) {
      this.ball.speed.x = Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier
    } else {
      this.ball.speed.x = -Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier
    }
  }

  protected nextRally() {
    if (!this.inSequence) {
      this.inSequence = true
      return
    }

    if (this.statistics.rallySequence == 0) {
      this.statistics.rallyInitiated++
    }

    this.statistics.rallySequence++
    this.statistics.totalRallySequence++
  }

  protected stopRally() {
    if (this.statistics.rallySequence > this.statistics.longestRallySequence) {
      this.statistics.longestRallySequence = this.statistics.rallySequence
    }

    this.statistics.rallySequence = 0
  }

  getAvgStatistics(): PaddleStatistics {
    return {
      countRounds: this.accStatistics.countRounds,
      roundVictories: this.accStatistics.roundVictories / (this.accStatistics.roundVictories || 1),
      score: this.accStatistics.score / (this.accStatistics.roundVictories || 1),
      ballsLost: this.accStatistics.ballsLost / (this.accStatistics.roundVictories || 1),
      scoresByAttack: this.accStatistics.scoresByAttack / (this.accStatistics.roundVictories || 1),
      rallySequence: this.accStatistics.rallySequence / (this.accStatistics.roundVictories || 1),
      rallyInitiated: this.accStatistics.rallyInitiated / (this.accStatistics.roundVictories || 1),
      longestRallySequence: this.accStatistics.longestRallySequence / (this.accStatistics.roundVictories || 1),
      totalRallySequence: this.accStatistics.totalRallySequence / (this.accStatistics.roundVictories || 1),
      anticipationTimes: this.accStatistics.anticipationTimes / (this.accStatistics.roundVictories || 1),
    }
  }

  setTable(table: Table) {
    this.table = table
  }

  setBall(ball: Ball) {
    this.ball = ball
  }

  setTypeDirectionBall(type: PaddleTypeDirectionBall) {
    this.typeDirectionBall = type
  }
}
