import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { TableSide } from "./game/types.js"
import { GLOBALS } from "./globals.js"
import { NeuralNetwork } from "./nn/core/neural-network.js"
import { PaddleNN } from "./nn/paddle-nn.js"
import { PaddlePlayer } from "./player/paddle-player.js"
import { getBestIndividualStorage } from "./utils/population-io.js"
import { resizeCanvas } from "./utils/utils.js"

window.onload = app

function app() {
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasGame, GLOBALS.game.table)

  const bestIndividual = getBestIndividualStorage() || NeuralNetwork.create(GLOBALS.network.structure, GLOBALS.network.activations)

  const paddle = new PaddleNN(10, 100, canvasGame.width, canvasGame.height, TableSide.RIGHT)

  paddle.network = bestIndividual

  const game = new Game(
    canvasGame.width,
    canvasGame.height,
    new PaddlePlayer(10, 100, canvasGame.width, canvasGame.height, TableSide.LEFT, 'w', 's'),
    paddle
  )
  const gameView = new GameView(canvasGame)

  gameView.setGame(game)

  game.start()
  gameView.start()
}
