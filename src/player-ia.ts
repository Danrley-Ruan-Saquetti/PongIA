import { GameView } from "./game/game-view.js"
import { Game } from "./game/game.js"
import { Table } from "./game/table.js"
import { GLOBALS } from "./globals.js"
import { NeuralNetwork } from "./nn/core/neural-network.js"
import { PaddleNN } from "./nn/paddle-nn.js"
import { PaddlePlayer } from "./player/paddle-player.js"
import { Dimension } from "./utils/dimension.js"
import { getBestIndividualStorage } from "./utils/population-io.js"
import { resizeCanvas } from "./utils/utils.js"

window.onload = app

function app() {
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasGame, GLOBALS.game.table)

  const table = new Table(new Dimension(canvasGame.width, canvasGame.height))

  const bestIndividual = getBestIndividualStorage() || NeuralNetwork.create(GLOBALS.network.structure, GLOBALS.network.activations)

  const paddlePlayer = new PaddlePlayer(new Dimension(10, 100), 'w', 's')
  const paddleNN = new PaddleNN(new Dimension(10, 100))

  paddleNN.network = bestIndividual

  const game = new Game(table)

  game.setPaddles(paddlePlayer, paddleNN)

  const gameView = new GameView(canvasGame)

  gameView.setGame(game)

  game.start()
  gameView.start()
}
