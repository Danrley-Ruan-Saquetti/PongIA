import { GameViewPlayer } from "./game/game-view-player.js"
import { Game } from "./game/game.js"
import { GLOBALS } from "./globals.js"
import { resizeCanvas } from "./utils/utils.js"

const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

resizeCanvas(canvasGame, GLOBALS.game.table)

const game = new Game(canvasGame.width, canvasGame.height)
const gameView = new GameViewPlayer(canvasGame)

gameView.setGame(game)

game.start()
gameView.start()
