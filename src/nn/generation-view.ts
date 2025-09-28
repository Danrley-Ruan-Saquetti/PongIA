import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { AITrainer } from './ai-trainer.js'
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
    let marginLeft = 10

    this.ctx.fillText("Game", marginLeft + 40, positionY)
    this.ctx.fillText("Time", marginLeft + 200, positionY)
    this.ctx.fillText("Score", marginLeft + 260, positionY)

    positionY += 30

    this.population.games.forEach((game, i) => {
      if (i < minRange || maxRange < i) {
        return
      }

      const state = game.getState()

      this.ctx.fillStyle = state.id == gameSelected.id ? '#fbff00ff' : (game.isRunning ? '#FFF' : '#FF0000')

      this.ctx.fillText(`#${i + 1}`, marginLeft + 5, positionY)
      this.ctx.fillText(state.id, marginLeft + 40, positionY)

      this.ctx.fillText(`${state.time.toFixed(0)}s`, marginLeft + 200, positionY)
      this.ctx.fillText(`${state.left.statistics.score} x ${state.right.statistics.score}`, marginLeft + 260, positionY)

      positionY += 30
    })

    this.ctx.fillStyle = '#FFF'

    positionY += 10

    this.ctx.fillText(`Total Games: ${this.population.games.length}`, 20, positionY)
    this.ctx.fillText(`Running: ${this.population.getCountGamesRunning()}`, 150, positionY)

    positionY += 30

    this.ctx.fillText(`Generation: ${this.population.population.getCurrentGeneration()}`, 20, positionY)
    this.ctx.fillText(`Record Fitness: ${this.population.population.getRecordFitness().toFixed(2)}`, 150, positionY)
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
