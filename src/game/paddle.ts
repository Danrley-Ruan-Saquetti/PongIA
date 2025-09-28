import { Vector2D } from "../utils/vector2d.js"
import { Ball } from "./ball.js"
import { TableSide } from "./types.js"

export type PaddleStatistics = {
  hitsBall: number
  score: number
  ballsLost: number
  scoresByAttack: number
  rallySequence: number
  rallyInitiated: number
  longestRallySequence: number
  totalRallySequence: number
}

export class Paddle {

  position: Vector2D
  speed = 6

  statistics: PaddleStatistics = {
    hitsBall: 0,
    score: 0,
    ballsLost: 0,
    scoresByAttack: 0,
    rallySequence: 0,
    rallyInitiated: 0,
    longestRallySequence: 0,
    totalRallySequence: 0,
  }

  private isMoveForAttack = false
  private isCounteredBall = false

  constructor(
    public width: number,
    public height: number,
    protected tableWidth: number,
    protected tableHeight: number,
    protected side: TableSide,
    public ball: Ball
  ) {
    this.position = new Vector2D()

    if (side == TableSide.LEFT) {
      this.position.x = 20
    } else {
      this.position.x = this.tableWidth - 30
    }

    this.reset()
  }

  reset() {
    this.position.y = (this.tableHeight / 2) - (this.height / 2)

    this.statistics = {
      hitsBall: 0,
      score: 0,
      ballsLost: 0,
      scoresByAttack: 0,
      rallySequence: 0,
      rallyInitiated: 0,
      longestRallySequence: 0,
      totalRallySequence: 0,
    }

    this.isMoveForAttack = false
    this.isCounteredBall = false
  }

  update() { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    ctx.textAlign = "center";
    ctx.font = "20px Arial";

    ctx.fillText(
      `Sequence: ${this.statistics.rallySequence}`,
      this.position.x + (this.side == TableSide.LEFT ? 150 : -150),
      this.tableHeight - 15
    );
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
  }

  onScore() {
    this.statistics.score++

    if (this.isCounteredBall) {
      this.statistics.scoresByAttack++

      this.isCounteredBall = false
      this.isMoveForAttack = false
    }
  }

  onLostBall() {
    this.statistics.ballsLost++

    this.isMoveForAttack = false
    this.isCounteredBall = false
  }

  onHitBall() {
    this.statistics.hitsBall++

    this.isCounteredBall = this.isMoveForAttack
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
}
