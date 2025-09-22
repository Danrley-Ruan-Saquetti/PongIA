import { GameViewPlayer } from "./game/game-view-player.js";
import { Game } from "./game/game.js";
import { resizeCanvas } from "./utils/utils.js";

const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement;

resizeCanvas(canvasGame, { weight: 800, height: 400 })

const game = new Game(canvasGame.width, canvasGame.height)
const gameView = new GameViewPlayer(canvasGame, game)

game.start()
gameView.start()
