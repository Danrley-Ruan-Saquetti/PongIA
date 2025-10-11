import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { AITrainer } from './ai-trainer.js'
import { computeFitness } from './fitness.js'
import { GameNN } from './game-nn.js'

export type GenerationViewEvents = {
  'game-selected/change': GameNN
}

export class GenerationView implements IObservable<GenerationViewEvents> {

  private observable: Observer<GenerationViewEvents>
  private ctx: CanvasRenderingContext2D
  protected timeInterval!: number

  private gameIndexSelected = 0

  constructor(protected canvas: HTMLCanvasElement, protected population: AITrainer) {
    this.ctx = canvas.getContext("2d")!
    this.observable = new Observer<GenerationViewEvents>()
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
    const gameIndexSelected = this.gameIndexSelected
    const gameSelected = this.population.games[this.gameIndexSelected]

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
    let marginLeft = 20

    this.ctx.fillText("Game", marginLeft + 40, positionY)
    this.ctx.fillText("Round", marginLeft + 150, positionY)
    this.ctx.fillText("Time", marginLeft + 220, positionY)
    this.ctx.fillText("Score", marginLeft + 280, positionY)

    positionY += 30

    this.ctx.fillRect(0, positionY - 23, this.canvas.width, 1)

    const games = this.population.games.sort((gameA, gameB) => gameB.getBestSequence() - gameA.getBestSequence())

    games.forEach((game, i) => {
      if (i < minRange || maxRange < i) {
        return
      }

      this.ctx.fillStyle = game.id == gameSelected.id ? '#fbff00ff' : (game.isRunning ? '#FFF' : '#FF0000')

      this.ctx.fillText(`#${i + 1}`, marginLeft + 5, positionY)
      this.ctx.fillText(game.id, marginLeft + 40, positionY)

      this.ctx.fillText(`${game.countRounds}`, marginLeft + 150, positionY)
      this.ctx.fillText(`${game.duration.toFixed(0)}s`, marginLeft + 220, positionY)
      this.ctx.fillText(`${game.getPaddleLeft().statistics.score} x ${game.getPaddleRight().statistics.score}`, marginLeft + 280, positionY)

      positionY += 30
    })

    this.ctx.fillStyle = '#FFF'

    this.ctx.fillRect(0, positionY - 15, this.canvas.width, 1)

    positionY += 10

    this.ctx.fillText(`Total Games: ${this.population.games.length}`, marginLeft, positionY)
    this.ctx.fillText(`Running: ${this.population.getCountGamesRunning()}`, marginLeft + 150, positionY)

    positionY += 30

    this.ctx.fillText(`Generation: ${this.population.population.getCurrentGeneration()}`, marginLeft, positionY)
    this.ctx.fillText(`Record Fitness: ${this.population.population.getRecordFitness().toFixed(2)}`, marginLeft + 150, positionY)

    positionY += 30

    this.ctx.fillText(`Avg Fitness: ${this.population.population.getAvgFitness().toFixed(2)}`, marginLeft, positionY)
    this.ctx.fillText(`Biggest Fitness: ${this.population.population.getCurrentBiggestFitness().toFixed(2)}`, marginLeft + 150, positionY)

    positionY += 30

    this.ctx.fillRect(0, positionY - 15, this.canvas.width, 1)

    positionY += 10

    this.ctx.fillText(`Statistics:`, marginLeft, positionY)
    this.ctx.fillText("Left", marginLeft + 150, positionY)
    this.ctx.fillText("Right", marginLeft + 250, positionY)

    positionY += 30

    this.ctx.fillText(`Score:`, marginLeft, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleLeft().statistics.score}`, marginLeft + 150, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleRight().statistics.score}`, marginLeft + 250, positionY)

    positionY += 30

    this.ctx.fillText(`Scored by Attack:`, marginLeft, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleLeft().statistics.scoresByAttack}`, marginLeft + 150, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleRight().statistics.scoresByAttack}`, marginLeft + 250, positionY)

    positionY += 30

    this.ctx.fillText(`Anticipations:`, marginLeft, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleLeft().statistics.anticipationTimes}`, marginLeft + 150, positionY)
    this.ctx.fillText(`${gameSelected.getPaddleRight().statistics.anticipationTimes}`, marginLeft + 250, positionY)

    positionY += 30

    const complexity = gameSelected.calcComplexity()
    const fitness = computeFitness(gameSelected.getPaddleNeuralNetwork().getAvgStatistics())

    this.ctx.fillText(`Fitness:`, marginLeft, positionY)
    this.ctx.fillText(`${fitness > 0 ? fitness * complexity : fitness * (1 + complexity)}`, marginLeft + 190, positionY)

    positionY += 30

    this.ctx.fillText(`Complexity:`, marginLeft, positionY)
    this.ctx.fillText(`${complexity.toFixed(2)}`, marginLeft + 190, positionY)
  }

  getGameSelected() {
    return this.population.games[this.gameIndexSelected]
  }

  setSelectGame(index: number) {
    this.gameIndexSelected = index % this.population.games.length

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  selectPreviousGame() {
    this.gameIndexSelected = (this.gameIndexSelected - 1 + this.population.games.length) % this.population.games.length

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  selectNextGame() {
    this.gameIndexSelected = ++this.gameIndexSelected % this.population.games.length

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  selectPreviousGameRunning() {
    let initialIndex = this.gameIndexSelected

    do {
      this.selectPreviousGame()
    } while (this.gameIndexSelected != initialIndex && !this.population.games[this.gameIndexSelected].isRunning)

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  selectNextGameRunning() {
    let initialIndex = this.gameIndexSelected

    do {
      this.selectNextGame()
    } while (this.gameIndexSelected != initialIndex && !this.population.games[this.gameIndexSelected].isRunning)

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  selectGameWithLongestSequence() {
    let indexGameWithLongestSequence = 0

    for (let i = 0; i < this.population.games.length; i++) {
      if (this.population.games[indexGameWithLongestSequence].getBestSequence() < this.population.games[i].getBestSequence()) {
        indexGameWithLongestSequence = i
      }
    }

    this.gameIndexSelected = indexGameWithLongestSequence

    this.observable.emit('game-selected/change', this.population.games[this.gameIndexSelected])
  }

  on<EventName extends keyof GenerationViewEvents>(event: EventName, handler: ListenerHandler<GenerationViewEvents[EventName]>) {
    return this.observable.on(event, handler)
  }

  clearListener(event: keyof GenerationViewEvents, id: string) {
    this.observable.clearListener(event, id)
  }

  clearAllListeners() {
    this.observable.clearAllListeners()
  }

  clearListenersByEvent(event: keyof GenerationViewEvents) {
    this.observable.clearListenersByEvent(event)
  }
}
