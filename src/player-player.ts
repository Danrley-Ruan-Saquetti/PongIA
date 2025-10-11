import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { Table } from "./game/table.js"
import { GLOBALS } from "./globals.js"
import { PaddlePlayer } from './player/paddle-player.js'
import { Dimension } from "./utils/dimension.js"
import { resizeCanvas } from "./utils/utils.js"

window.onload = app

function app() {
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasGame, GLOBALS.game.table)

  const table = new Table()

  table.dimension = new Dimension(canvasGame.width, canvasGame.height)

  const game = new Game(table)

  game.setPaddles(
    new PaddlePlayer('w', 's'),
    new PaddlePlayer('ArrowUp', 'ArrowDown')
  )

  const gameView = new GameView(canvasGame)

  gameView.setGame(game)

  game.start()
  gameView.start()
}
