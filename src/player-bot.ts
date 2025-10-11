import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { PaddleBot } from './game/paddle-bot.js'
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

  const paddlePlayer = new PaddlePlayer(new Dimension(10, 100), TableSide.LEFT, 'w', 's')
  const paddleBot = new PaddleBot(new Dimension(10, 100), TableSide.RIGHT)

  const game = new Game(table)

  game.setPaddle(paddlePlayer)
  game.setPaddle(paddleBot)

  const gameView = new GameView(canvasGame)

  game.options.limitTime = 1000 * 60

  gameView.setGame(game)

  game.start()
  gameView.start()
}
