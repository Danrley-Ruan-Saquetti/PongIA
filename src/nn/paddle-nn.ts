import { Ball } from "../game/ball.js";
import { Paddle } from "../game/paddle.js";
import { TableSide } from "../game/types.js";
import { GLOBALS } from "../globals.js";
import { NeuralNetwork } from "./core/neural-network.js";

export class PaddleNN extends Paddle {

  constructor(
    width: number,
    height: number,
    tableHeight: number,
    side: TableSide,
    public ball: Ball,
    public network: NeuralNetwork
  ) {
    super(width, height, tableHeight, side)
  }

  update() {
    const [up, down, stay] = this.network.feedforward([
      this.y,
      this.ball.x,
      this.ball.y,
      Math.abs(this.ball.speedX),
      this.ball.speedY,
    ])

    if (up > down && up > stay) {
      this.moveUp()
    }
    else if (down > up && down > stay) {
      this.moveDown()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx)

    ctx.textAlign = "center";
    ctx.font = "20px Arial";

    ctx.fillText(
      `${this.network.fitness.toFixed(2)}`,
      this.x + (this.side == TableSide.LEFT ? 150 : -150),
      this.tableHeight - 15
    );
  }

  moveUp() {
    super.moveUp()
    this.onNetworkAction()
  }

  moveDown() {
    super.moveDown()
    this.onNetworkAction()
  }

  onBallHit() {
    this.network.fitness += GLOBALS.network.fitness.onBallHit
  }

  onLostBall() {
    this.network.fitness += GLOBALS.network.fitness.onBallLost
  }

  private onNetworkAction() {
    if (this.ball.y - this.ball.radius >= this.y && this.ball.y + this.ball.radius <= this.y + this.height) {
      this.network.fitness += GLOBALS.network.fitness.onFollowBall
    }
  }
}
