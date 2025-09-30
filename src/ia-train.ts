import { GameView } from "./game/game-view.js"
import { GLOBALS } from "./globals.js"
import { AITrainer } from './nn/ai-trainer.js'
import { Population } from "./nn/core/population.js"
import { GenerationView } from './nn/generation-view.js'
import { clearStorage, getGenerationStorage, saveGeneration } from "./utils/population-io.js"
import { resizeCanvas } from './utils/utils.js'

window.onload = app

function app() {
  document.querySelector("#loadPopulation")?.addEventListener('click', () => loadPopulation())
  document.querySelector("#resetProgress")?.addEventListener('click', () => resetProgress())
  document.querySelector("#copyPopulation")?.addEventListener('click', () => copyPopulation())

  const canvasRank = document.getElementById("rankCanvas") as HTMLCanvasElement
  const canvasGame = document.getElementById("gameCanvas") as HTMLCanvasElement

  resizeCanvas(canvasRank, { width: 375, height: 650 })
  resizeCanvas(canvasGame, GLOBALS.game.table)

  const aiTrainer = new AITrainer(canvasGame.width, canvasGame.height)

  const generationView = new GenerationView(canvasRank, aiTrainer)
  const gameView = new GameView(canvasGame)

  aiTrainer.on('next-generation', () => {
    gameView.setGame(generationView.getGameSelected())
  })

  generationView.on('game-selected/change', game => gameView.setGame(game))

  aiTrainer.startGames()

  gameView.setGame(generationView.getGameSelected())

  gameView.start()
  generationView.start()

  const KEY_MAP: Record<string, () => void> = {
    '1': () => generationView.selectPreviousGame(),
    '2': () => generationView.selectNextGame(),
    '3': () => generationView.selectPreviousGameRunning(),
    '4': () => generationView.selectNextGameRunning(),
    '5': () => generationView.selectGameWithLongestSequence(),
  }

  setInterval(() => generationView.selectGameWithLongestSequence(), 1000 / 10)

  let isKeyPressed = false

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

  function loadPopulation() {
    const populationRaw = JSON.parse(document.querySelector<HTMLInputElement>("#population-json")!.value)

    if (!populationRaw || !Array.isArray(populationRaw)) {
      return
    }

    saveGeneration({ population: Population.from(populationRaw, GLOBALS.network.activations) })

    window.location.reload()
  }

  function resetProgress() {
    clearStorage()

    window.location.reload()
  }

  async function copyPopulation() {
    const population = getGenerationStorage() || aiTrainer.population

    await navigator.clipboard.writeText(JSON.stringify(population.toJSON()))
  }
}
