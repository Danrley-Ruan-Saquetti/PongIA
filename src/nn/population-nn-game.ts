import { GLOBALS } from '../globals.js'
import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { Population } from './core/population.js'
import { GameNN } from './game-nn.js'

type PopulationNNGameEvents = {
  'game-stop': GameNN
  'next-generation': undefined
}

export class PopulationNNGame implements IObservable<PopulationNNGameEvents> {

  private observer: Observer<PopulationNNGameEvents>

  population: Population = null!
  games: GameNN[] = []

  countGamesRunning = 0

  gameIndexSelected = -1

  constructor(private width: number, private height: number) {
    this.observer = new Observer<PopulationNNGameEvents>()
    this.loadPopulation()
  }

  initializeGames() {
    const neuralNetworksInGame = new Set<number>()

    const getNeuralNetworkNotInGame = () => {
      if (neuralNetworksInGame.size == this.population.individuals.length) {
        return -1
      }

      let index: number

      do {
        index = Math.floor(Math.random() * this.population.individuals.length)
      } while (neuralNetworksInGame.has(index))

      neuralNetworksInGame.add(index)

      return index
    }

    const GAME_LENGTHS = this.population.individuals.length / 2
    this.countGamesRunning = GAME_LENGTHS

    this.games = Array.from<GameNN>({ length: GAME_LENGTHS })
      .map(() => {
        const game = new GameNN(
          this.width,
          this.height,
          this.population.individuals[getNeuralNetworkNotInGame()],
          this.population.individuals[getNeuralNetworkNotInGame()]
        )

        const listenerId = game.on('game/stop', () => {
          game.clearListener('game/stop', listenerId)

          this.countGamesRunning--

          if (this.countGamesRunning == 0) {
            this.nextGeneration()
          }
        })

        game.start()

        return game
      })

    this.gameIndexSelected = 0
  }

  setSelectGame(index: number) {
    this.gameIndexSelected = index % this.games.length
  }

  selectPreviousGame() {
    this.gameIndexSelected = (this.gameIndexSelected - 1 + this.games.length) % this.games.length
  }

  selectNextGame() {
    this.gameIndexSelected = ++this.gameIndexSelected % this.games.length
  }

  selectPreviousGameRunning() {
    let initialIndex = this.gameIndexSelected

    do {
      this.selectPreviousGame()
    } while (this.gameIndexSelected != initialIndex && !this.getGameSelected().isRunning)
  }

  selectGameWithBestFitnessRunning() {
    let indexGameWithBestFitness = 0

    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].isRunning && this.games[indexGameWithBestFitness].getState().bestFitness < this.games[i].getState().bestFitness) {
        indexGameWithBestFitness = i
      }
    }

    this.gameIndexSelected = indexGameWithBestFitness
  }

  selectNextGameRunning() {
    let initialIndex = this.gameIndexSelected

    do {
      this.selectNextGame()
    } while (this.gameIndexSelected != initialIndex && !this.getGameSelected().isRunning)
  }

  getGameIndexSelected() {
    return this.gameIndexSelected
  }

  getGameSelected() {
    return this.games[this.gameIndexSelected]
  }

  nextGeneration() {
    this.population.nextGeneration(GLOBALS.evolution)
    this.savePopulation(this.population)
    this.initializeGames()
    this.observer.emit('next-generation', undefined)
  }

  getCountGamesRunning() {
    return this.countGamesRunning
  }

  loadPopulation() {
    this.population = this.getPopulation()
  }

  savePopulation(population: Population) {
    if (GLOBALS.storage) {
      localStorage.setItem('population', JSON.stringify(population.toJSON()))
    }
  }

  getPopulation() {
    const populationStorage = this.getPopulationStorage()

    if (populationStorage) {
      return populationStorage
    }

    const population = Population.createPopulation(GLOBALS.population.size, GLOBALS.network.structure, GLOBALS.network.activation)

    population.randomize(-GLOBALS.network.rateInitialRandomInterval, GLOBALS.network.rateInitialRandomInterval)

    return population
  }

  getPopulationStorage(): Population | null {
    if (!GLOBALS.storage.enable) {
      return null
    }

    const populationStorage = JSON.parse(localStorage.getItem('population')!)

    if (!populationStorage) {
      return null
    }

    return Population.from(populationStorage, x => x)
  }

  on<EventName extends keyof PopulationNNGameEvents>(event: EventName, handler: ListenerHandler<PopulationNNGameEvents[EventName]>) {
    return this.observer.on(event, handler)
  }

  clearListener(event: keyof PopulationNNGameEvents, id: string) {
    this.observer.clearListener(event, id)
  }

  clearAllListeners() {
    this.observer.clearAllListeners()
  }

  clearListenersByEvent(event: keyof PopulationNNGameEvents) {
    this.observer.clearListenersByEvent(event)
  }
}
