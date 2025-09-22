import { GenerationView } from './nn/generation-view.js';
import { PopulationNNGame } from './nn/population-nn-game.js';
import { GameView } from "./game/game-view.js";
import { resizeCanvas } from './utils/utils.js';

const canvasRank = document.getElementById("rankCanvas") as HTMLCanvasElement;
const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement;

resizeCanvas(canvasRank, { weight: 375, height: 500 })
resizeCanvas(canvasGame, { weight: 800, height: 500 })

const populationGame = new PopulationNNGame(canvasGame.width, canvasGame.height)

populationGame.on('next-generation', () => {
  gameView.setGame(populationGame.getGameSelected())
})

populationGame.loadPopulation()
populationGame.initializeGames()

const gameView = new GameView(canvasGame, populationGame.games[0]);
const rankView = new GenerationView(canvasRank, populationGame)

gameView.start()
rankView.start()

let isKeyPressed = false

const KEY_MAP: Record<string, () => void> = {
  '1': () => populationGame.selectPreviousGame(),
  '2': () => populationGame.selectNextGame(),
  '3': () => populationGame.selectPreviousGameRunning(),
  '4': () => populationGame.selectNextGameRunning(),
  '5': () => populationGame.selectGameWithBestFitnessRunning(),
}

addEventListener('keydown', ({ key }) => {
  if (!isKeyPressed && KEY_MAP[key]) {
    isKeyPressed = true

    KEY_MAP[key]()
  }
})

addEventListener('keyup', ({ key }) => {
  if (KEY_MAP[key]) {
    isKeyPressed = false
  }
})

setInterval(() => gameView.setGame(populationGame.getGameSelected()), 1000 / 10)
