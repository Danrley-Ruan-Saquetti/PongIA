import { MultiGameController } from "../game/multi-game-controller.js"
import { GLOBALS } from "../globals.js"
import { IObservable, ListenerHandler, Observer } from "../utils/observer.js"
import { getGenerationStorage, saveGeneration } from "../utils/population-io.js"
import { NeuralNetwork } from "./core/neural-network.js"
import { Population } from './core/population.js'
import { computeFitness } from "./fitness.js"
import { GameNN } from './game-nn.js'

type AITrainerEvents = {
  'game-stop': GameNN
  'next-generation': undefined
}

export class AITrainer extends MultiGameController<GameNN> implements IObservable<AITrainerEvents> {

  private observer: Observer<AITrainerEvents>
  private neuralNetworks: NeuralNetwork[] = []

  population!: Population

  constructor(
    tableWith: number,
    tableHeight: number
  ) {
    super(tableWith, tableHeight, GLOBALS.population.pairs)
    this.observer = new Observer<AITrainerEvents>()

    this.loadPopulation()
  }

  protected onAllGamesFinish() {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i]

      const complexity = game.calcComplexity()

      game.getPaddleLeft().network.fitness = computeFitness(game.getPaddleLeft().statistics) * complexity
      game.getPaddleRight().network.fitness = computeFitness(game.getPaddleRight().statistics) * complexity
    }

    const best = this.population.getBestIndividual()

    this.population.nextGeneration(GLOBALS.evolution)
    this.neuralNetworks = this.population.individuals.map(network => network)

    saveGeneration({ population: this.population, best })

    this.startGames()

    this.observer.emit('next-generation', undefined)
  }

  protected createInstanceGame() {
    const game = new GameNN(this.tableWith, this.tableHeight)

    game.on('game/start', () => {
      const [networkLeft] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1)
      const [networkRight] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1)

      game.setNeuralNetworkLeft(networkLeft)
      game.setNeuralNetworkRight(networkRight)
    })

    return game
  }

  private loadPopulation() {
    this.population = AITrainer.getGeneration()
    this.neuralNetworks = this.population.individuals.map(network => network)
  }

  on<EventName extends keyof AITrainerEvents>(event: EventName, handler: ListenerHandler<AITrainerEvents[EventName]>) {
    return this.observer.on(event, handler)
  }

  clearListener(event: keyof AITrainerEvents, id: string) {
    this.observer.clearListener(event, id)
  }

  clearAllListeners() {
    this.observer.clearAllListeners()
  }

  clearListenersByEvent(event: keyof AITrainerEvents) {
    this.observer.clearListenersByEvent(event)
  }

  private static getGeneration() {
    const populationStorage = getGenerationStorage()

    if (populationStorage) {
      console.log('Load population from Storage')

      return populationStorage
    }

    console.log('Create new Population')

    const population = Population.createPopulation(GLOBALS.population.pairs * 2, GLOBALS.network.structure, GLOBALS.network.activations)

    population.randomize(-GLOBALS.network.rateInitialRandomInterval, GLOBALS.network.rateInitialRandomInterval)

    return population
  }
}
