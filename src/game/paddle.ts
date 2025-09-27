import { Vector2D } from "../utils/vector2d.js"
import { TableSide } from "./types.js"

export class Paddle {

  position: Vector2D
  speed = 6

  score = 0

  constructor(
    public width: number,
    public height: number,
    protected tableWidth: number,
    protected tableHeight: number,
    protected side: TableSide
  ) {
    this.position = new Vector2D()

    if (side == TableSide.LEFT) {
      this.position.x = 20
    } else {
      this.position.x = this.tableWidth - 35
    }

    this.reset()
  }

  reset() {
    this.position.y = this.tableHeight / 2 - this.height
    this.score = 0
  }

  update() { }

  moveUp() {
    this.position.y -= this.speed

    if (this.position.y < 0) {
      this.position.y = 0
    }
  }

  moveDown() {
    this.position.y += this.speed

    if (this.position.y + this.height > this.tableHeight) {
      this.position.y = this.tableHeight - this.height
    }
  }

  onBallHit() { }

  onLostBall() { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
