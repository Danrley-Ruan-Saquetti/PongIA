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
    const state = this.game.getState()

    this.ctx.clearRect(0, 0, state.width, state.height)

    this.ctx.strokeStyle = "white"
    this.ctx.beginPath()
    this.ctx.setLineDash([10, 10])
    this.ctx.moveTo(state.width / 2, 0)
    this.ctx.lineTo(state.width / 2, state.height)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    state.left.draw(this.ctx)
    state.right.draw(this.ctx)

    state.ball.draw(this.ctx)

    this.ctx.fillStyle = '#FFF'

    this.ctx.textAlign = "center"

    this.ctx.font = "30px Arial"
    this.ctx.fillText(
      `${state.id}`,
      100,
      30
    )

    this.ctx.fillText(
      `${state.time.toFixed(1)}s`,
      state.width / 2,
      30
    )

    this.ctx.fillText(
      `${state.left.statistics.score} - ${state.right.statistics.score}`,
      state.width / 2,
      70
    )

    if (!this.game.isRunning) {
      if (this.game.paddleLeft.statistics.score > this.game.paddleRight.statistics.score) {
        this.ctx.fillText(
          `Winner`,
          state.width / 4,
          state.height / 2
        )
      }
      else if (this.game.paddleLeft.statistics.score < this.game.paddleRight.statistics.score) {
        this.ctx.fillText(
          `Winner`,
          (state.width / 4) * 3,
          state.height / 2
        )
      }
      else {
        this.ctx.fillText(
          `Draw`,
          state.width / 4,
          state.height / 2
        )
        this.ctx.fillText(
          `Draw`,
          (state.width / 4) * 3,
          state.height / 2
        )
      }
    }
  }

  setGame(game: Game) {
    this.game = game
  }
}
