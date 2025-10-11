import { Game } from "./game.js"

export class GameView {

  private ctx: CanvasRenderingContext2D

  protected game: Game

  protected animationFrame: number

  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!
  }

  stop() {
    cancelAnimationFrame(this.animationFrame)
  }

  start() {
    this.animationFrame = requestAnimationFrame(() => this.loop())
  }

  private loop() {
    this.updateInternal()
    this.draw()
    this.animationFrame = requestAnimationFrame(() => this.loop())
  }

  protected updateInternal() { }

  private draw() {
    const table = this.game.getTable()
    const ball = this.game.getBall()
    const paddleLeft = this.game.getPaddleLeft()
    const paddleRight = this.game.getPaddleRight()

    this.ctx.clearRect(0, 0, table.dimension.width, table.dimension.height)

    this.ctx.strokeStyle = "white"
    this.ctx.beginPath()
    this.ctx.setLineDash([10, 10])
    this.ctx.moveTo(table.dimension.width / 2, 0)
    this.ctx.lineTo(table.dimension.width / 2, table.dimension.height)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    paddleLeft.draw(this.ctx)
    paddleRight.draw(this.ctx)

    ball.draw(this.ctx)

    this.ctx.fillStyle = '#FFF'

    this.ctx.textAlign = "center"

    this.ctx.font = "30px Arial"
    this.ctx.fillText(
      `${this.game.id}`,
      100,
      30
    )

    this.ctx.fillStyle = this.game.FPS >= this.game.FPS_LOCKED ? '#64f22dff' : this.game.FPS < this.game.FPS_LOCKED - 20 ? '#FF0000' : '#3870fdff'
    this.ctx.font = "15px Arial"
    this.ctx.fillText(
      `${this.game.FPS}FPS`,
      200,
      25
    )

    this.ctx.fillStyle = '#FFF'

    this.ctx.font = "30px Arial"

    this.ctx.fillText(
      `${this.game.duration.toFixed(1)}s`,
      (table.dimension.width / 2) + 100,
      30
    )

    this.ctx.fillText(
      `${paddleLeft.statistics.score} - ${paddleRight.statistics.score}`,
      table.dimension.width / 2,
      30
    )

    this.ctx.font = "20px Arial"
    this.ctx.fillText(
      `${paddleLeft.accStatistics.roundVictories} - ${paddleRight.accStatistics.roundVictories}`,
      table.dimension.width / 2,
      60
    )

    this.ctx.font = "30px Arial"

    if (!this.game.isRunning) {
      if (paddleLeft.accStatistics.roundVictories > paddleRight.accStatistics.roundVictories) {
        this.ctx.fillText(
          `Winner`,
          table.dimension.width / 4,
          table.dimension.height / 2
        )
      }
      else if (paddleLeft.accStatistics.roundVictories < paddleRight.accStatistics.roundVictories) {
        this.ctx.fillText(
          `Winner`,
          (table.dimension.width / 4) * 3,
          table.dimension.height / 2
        )
      }
      else {
        this.ctx.fillText(
          `Draw`,
          table.dimension.width / 4,
          table.dimension.height / 2
        )
        this.ctx.fillText(
          `Draw`,
          (table.dimension.width / 4) * 3,
          table.dimension.height / 2
        )
      }
    }
  }

  setGame(game: Game) {
    this.game = game
  }
}
