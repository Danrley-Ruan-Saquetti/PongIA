import { Vector2D } from "../utils/vector2d.js"
import { Ball } from "./ball.js"
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

export class Paddle {

  ball: Ball

  position: Vector2D
  speed = 6

  color = 'white'

  statistics: PaddleStatistics = Paddle.getDefaultStatistics()
  accStatistics: PaddleStatistics = Paddle.getDefaultStatistics()

  private isMoveForAttack = false
  private isCounteredBall = false

  private isAnticipated = false

  constructor(
    public width: number,
    public height: number,
    protected tableWidth: number,
    protected tableHeight: number,
    public readonly side: TableSide,
  ) {
    this.position = new Vector2D()

    if (side == TableSide.LEFT) {
      this.position.x = 20
    } else {
      this.position.x = this.tableWidth - 30
    }
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
    this.position.y = (this.tableHeight / 2) - (this.height / 2)

    this.isMoveForAttack = false
    this.isCounteredBall = false
    this.isAnticipated = false
  }

  update() { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    ctx.textAlign = "center"
    ctx.font = "20px Arial"
    ctx.fillStyle = 'white'

    ctx.fillText(
      `Sequence: ${this.statistics.rallySequence}`,
      this.position.x + (this.side == TableSide.LEFT ? 150 : -150),
      this.tableHeight - 15
    )
  }

  moveUp() {
    this.position.y -= this.speed

    if (this.position.y < 0) {
      this.position.y = 0
    }
    else {
      this.onMoved()
    }
  }

  moveDown() {
    this.position.y += this.speed

    if (this.position.y + this.height > this.tableHeight) {
      this.position.y = this.tableHeight - this.height
    }
    else {
      this.onMoved()
    }
  }

  onMoved() {
    this.isMoveForAttack = true

    if (!this.ball.isBallIntoSide(this.side)) {
      return
    }

    if (this.position.y <= this.ball.finalY && this.ball.finalY <= this.position.y + this.height) {
      if (!this.ball.isCrossedTable()) {
        this.isAnticipated = true
      }
    } else {
      if (this.ball.isCrossedTable()) {
        this.isAnticipated = false
      }
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
    const relativeIntersectY = this.ball.position.y - (this.position.y + this.height / 2)
    const normalizedIntersectY = relativeIntersectY / (this.height / 2)
    const maxBounceAngle = Math.PI / 3
    const bounceAngle = normalizedIntersectY * maxBounceAngle

    const speed = Math.sqrt(this.ball.speed.x * this.ball.speed.x + this.ball.speed.y * this.ball.speed.y)

    this.ball.speed.y = speed * Math.sin(bounceAngle)

    if (this.side === TableSide.LEFT) {
      this.ball.speed.x = Math.abs(speed * Math.cos(bounceAngle))
    } else {
      this.ball.speed.x = -Math.abs(speed * Math.cos(bounceAngle))
    }
  }

  protected nextRally() {
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
}
