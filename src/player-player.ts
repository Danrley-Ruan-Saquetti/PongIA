import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { Table } from "./game/table.js"
import { TableSide } from './game/types.js'
import { GLOBALS } from "./globals.js"
import { PaddlePlayer } from './player/paddle-player.js'
import { Dimension } from "./utils/dimension.js"
import { resizeCanvas } from "./utils/utils.js"

window.onload = app

function app() {
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasGame, GLOBALS.game.table)

  const table = new Table(new Dimension(canvasGame.width, canvasGame.height))

  const playerA = new PaddlePlayer(new Dimension(10, 100), TableSide.LEFT, 'w', 's')
  const playerB = new PaddlePlayer(new Dimension(10, 100), TableSide.RIGHT, 'ArrowUp', 'ArrowDown')

  const game = new Game(table)

  game.setPaddle(playerA)
  game.setPaddle(playerB)

  const gameView = new GameView(canvasGame)

  gameView.setGame(game)

  game.start()
  gameView.start()
}
