import { TableSide } from "./types.js"

export class Paddle {

  private speed: number = 6

  score: number = 0

  x: number
  y: number

  constructor(
    public width: number,
    public height: number,
    protected tableHeight: number,
    protected side: TableSide
  ) {
    this.y = this.height / 2 - 50

    if (side == TableSide.LEFT) {
      this.x = 20
    } else {
      this.x = this.width - 35
    }
  }

  reset() {

  }

  update() { }

  moveUp() {
    this.y -= this.speed

    if (this.y < 0) {
      this.y = 0
    }
  }

  moveDown() {
    this.y += this.speed

    if (this.y + this.height > this.tableHeight) {
      this.y = this.tableHeight - this.height
    }
  }

  onBallHit() { }

  onLostBall() { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
