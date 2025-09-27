import { MultiGameController } from "../game/multi-game-controller.js";
import { GLOBALS } from "../globals.js";
import { IObservable, ListenerHandler, Observer } from "../utils/observer.js";
import { getPopulationStorage, savePopulation } from "../utils/population-io.js";
import { Population } from './core/population.js';
import { GameNN } from './game-nn.js';

type PopulationNNGameEvents = {
  'game-stop': GameNN
  'next-generation': undefined
}

export class AITrainer extends MultiGameController<GameNN> implements IObservable<PopulationNNGameEvents> {

  private observer: Observer<PopulationNNGameEvents>

  population!: Population

  constructor(
    private tableWith: number,
    private tableHeight: number
  ) {
    super(GLOBALS.population.size / 2)
    this.observer = new Observer<PopulationNNGameEvents>()

    this.loadPopulation()
  }

  protected onAllGamesFinish() {
    this.population.nextGeneration(GLOBALS.evolution)

    savePopulation(this.population)

    this.startGames()

    this.observer.emit('next-generation', undefined)
  }

  protected createInstanceGame() {
    return new GameNN(this.tableWith, this.tableHeight)
  }

  private loadPopulation() {
    this.population = AITrainer.getPopulation()
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

  private static getPopulation() {
    const populationStorage = getPopulationStorage()

    if (populationStorage) {
      return populationStorage
    }

    const population = Population.createPopulation(GLOBALS.population.size, GLOBALS.network.structure, GLOBALS.network.activation)

    population.randomize(-GLOBALS.network.rateInitialRandomInterval, GLOBALS.network.rateInitialRandomInterval)

    return population
  }
}
