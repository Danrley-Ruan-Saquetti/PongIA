import { PopulationNNGame } from './population-nn-game.js'

export class GenerationView {
  private ctx: CanvasRenderingContext2D

  protected timeInterval!: number

  constructor(protected canvas: HTMLCanvasElement, protected population: PopulationNNGame) {
    this.ctx = canvas.getContext("2d")!
  }

  stop() {
    clearInterval(this.timeInterval)
  }

  start() {
    this.timeInterval = setInterval(() => this.loop(), 1000 / 10)
  }

  private loop() {
    this.draw()
  }

  private draw() {
    const gameIndexSelected = this.population.getGameIndexSelected()
    const gameSelected = this.population.getGameSelected()

    let minRange = Math.max(0, gameIndexSelected - 4)
    let maxRange = Math.min(this.population.games.length - 1, gameIndexSelected + 5)

    if (maxRange - minRange < 9) {
      maxRange = Math.min(this.population.games.length - 1, minRange + 9)
    }

    if (maxRange - minRange < 9) {
      minRange = Math.max(0, maxRange - 9)
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = '#FFF'

    let positionY = 30
    let marginLeft = 10

    this.ctx.fillText("Game", marginLeft + 40, positionY)
    this.ctx.fillText("Time", marginLeft + 140, positionY)
    this.ctx.fillText("Score", marginLeft + 200, positionY)
    this.ctx.fillText("Best Fitness", marginLeft + 260, positionY)

    positionY += 30

    const games = this.population.games.sort((gameA, gameB) => {
      return gameB.getState().bestFitness - gameA.getState().bestFitness
    })

    games.forEach((game, i) => {
      if (i < minRange || maxRange < i) {
        return
      }

      const state = game.getState()

      this.ctx.fillStyle = state.id == gameSelected.id ? '#fbff00ff' : (game.isRunning ? '#FFF' : '#FF0000')

      this.ctx.fillText(`#${i + 1}`, marginLeft + 5, positionY)
      this.ctx.fillText(state.id, marginLeft + 40, positionY)

      this.ctx.fillStyle = '#FFF'

      this.ctx.fillText(`${state.time.toFixed(0)}s`, marginLeft + 140, positionY)
      this.ctx.fillText(`${state.left.score} x ${state.right.score}`, marginLeft + 200, positionY)
      this.ctx.fillText(`${state.bestFitness.toFixed(2)}`, marginLeft + 260, positionY)

      positionY += 30
    })

    positionY += 10

    this.ctx.fillText(`Total Games: ${this.population.games.length}`, 20, positionY)
    this.ctx.fillText(`Running: ${this.population.getCountGamesRunning()}`, 150, positionY)

    positionY += 30

    this.ctx.fillText(`Generation: ${this.population.population.getCurrentGeneration()}`, 20, positionY)
    this.ctx.fillText(`Record Fitness: ${this.population.population.getRecordFitness().toFixed(2)}`, 150, positionY)
  }
}
