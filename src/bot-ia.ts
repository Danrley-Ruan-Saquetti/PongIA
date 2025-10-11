import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { PaddleBot } from "./game/paddle-bot.js"
import { Table } from "./game/table.js"
import { GLOBALS } from "./globals.js"
import { NeuralNetwork } from "./nn/core/neural-network.js"
import { PaddleNN } from "./nn/paddle-nn.js"
import { Dimension } from "./utils/dimension.js"
import { getBestIndividualStorage } from "./utils/population-io.js"
import { resizeCanvas } from "./utils/utils.js"

window.onload = app

function app() {
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasGame, GLOBALS.game.table)

  const table = new Table()

  table.dimension = new Dimension(canvasGame.width, canvasGame.height)

  const bestIndividual = getBestIndividualStorage() || NeuralNetwork.create(GLOBALS.network.structure, GLOBALS.network.activations)

  const paddleNetwork = new PaddleNN()
  const paddleBot = new PaddleBot()

  const game = new Game(table)

  game.setPaddles(paddleNetwork, paddleBot)

  paddleNetwork.network = bestIndividual

  game.options.limitTime = 1000 * 60
  game.options.maxScore = 60

  const gameView = new GameView(canvasGame)

  gameView.setGame(game)

  game.start()
  gameView.start()
}
