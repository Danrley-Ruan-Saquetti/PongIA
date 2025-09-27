import { GameView } from "./game-view.js"

export class GameViewPlayer extends GameView {
  private keys: Set<string> = new Set()

  private listenerOnGameStopId: string

  onKeyDown = (e: KeyboardEvent) => this.keys.add(e.key)
  onkeyUp = (e: KeyboardEvent) => this.keys.delete(e.key)

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.registerEvents()
  }

  private registerEvents() {
    this.listenerOnGameStopId = this.game.on('game/stop', () => {
      window.removeEventListener("keydown", this.onKeyDown)
      window.removeEventListener("keyup", this.onkeyUp)

      this.keys.clear()

      this.game.clearListener('game/stop', this.listenerOnGameStopId)
    })

    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onkeyUp)
  }

  protected updateInternal() {
    this.handleInput()
  }

  private handleInput() {
    if (this.keys.has("w")) this.game.moveLeftUp()
    if (this.keys.has("s")) this.game.moveLeftDown()
    if (this.keys.has("ArrowUp")) this.game.moveRightUp()
    if (this.keys.has("ArrowDown")) this.game.moveRightDown()
  }
}
