import { Paddle } from '../game/paddle.js'
import { TableSide } from '../game/types.js'
import { Dimension } from '../utils/dimension.js'

export class PaddlePlayer extends Paddle {

  private keysPressed: Set<string> = new Set<string>()

  onKeyDown = (e: KeyboardEvent) => this.keysPressed.add(e.key)
  onkeyUp = (e: KeyboardEvent) => this.keysPressed.delete(e.key)

  constructor(
    dimension: Dimension,
    side: TableSide,
    private keyUp: string,
    private keyDown: string
  ) {
    super(dimension, side)
  }

  reset() {
    super.reset()

    this.keysPressed.clear()

    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onkeyUp)

    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onkeyUp)
  }

  update() {
    super.update()

    if (this.keysPressed.has(this.keyUp)) this.moveUp()
    if (this.keysPressed.has(this.keyDown)) this.moveDown()
  }
}
