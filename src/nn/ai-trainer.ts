import { MultiGameController } from "../game/multi-game-controller.js"
import { PaddleBot } from "../game/paddle-bot.js"
import { TableSide } from "../game/types.js"
import { GLOBALS } from "../globals.js"
import { IObservable, ListenerHandler, Observer } from "../utils/observer.js"
import { getGenerationStorage, saveGeneration } from "../utils/population-io.js"
import { NeuralNetwork } from "./core/neural-network.js"
import { Population } from './core/population.js'
import { computeFitness } from "./fitness.js"
import { GameNN } from './game-nn.js'
import { PaddleNN } from "./paddle-nn.js"

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
    super(tableWith, tableHeight, GLOBALS.population.size)
    this.observer = new Observer<AITrainerEvents>()

    this.loadPopulation()
  }

  protected onAllGamesFinish() {
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i]

      const complexity = game.calcComplexity()

      game.getPaddleNeuralNetwork().network.fitness = computeFitness(game.getPaddleNeuralNetwork().getAvgStatistics()) * complexity
    }

    const bestIndividual = this.population.getBestIndividual()

    const best = bestIndividual.clone()
    best.fitness = bestIndividual.fitness

    this.population.nextGeneration(GLOBALS.evolution)
    this.neuralNetworks = this.population.individuals.map(network => network)

    if (GLOBALS.storage.enable) {
      saveGeneration({ population: this.population, best })
    }

    this.startGames()

    this.observer.emit('next-generation', undefined)
  }

  protected createInstanceGame() {
    const paddleNetworkSide = Math.random() < .5 ? TableSide.LEFT : TableSide.RIGHT

    const paddleNetwork = new PaddleNN(10, 100, this.tableWith, this.tableHeight, paddleNetworkSide)
    const paddleBot = new PaddleBot(10, 100, this.tableWith, this.tableHeight, paddleNetworkSide == TableSide.LEFT ? TableSide.RIGHT : TableSide.LEFT)

    const game = new GameNN(
      this.tableWith,
      this.tableHeight,
      paddleNetwork,
      paddleBot
    )

    game.options = { ...GLOBALS.evolution.gameOptions }

    game.on('game/start', () => {
      const [networkLeft] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1)

      game.setNeuralNetwork(networkLeft)
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
    const populationStorage = GLOBALS.storage.enable ? getGenerationStorage() : null

    if (populationStorage) {
      console.log('Load population from Storage')

      return populationStorage
    }

    console.log('Create new Population')

    const population = Population.createPopulation(GLOBALS.population.size, GLOBALS.network.structure, GLOBALS.network.activations)

    population.randomizeWeights(GLOBALS.network.rateWeightsInitialInterval.min, GLOBALS.network.rateWeightsInitialInterval.max)
    population.randomizeBiases(GLOBALS.network.rateBiasesInitialInterval.min, GLOBALS.network.rateBiasesInitialInterval.max)

    return population
  }
}
