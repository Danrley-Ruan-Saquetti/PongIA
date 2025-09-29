import { MultiGameController } from "../game/multi-game-controller.js";
import { TableSide } from "../game/types.js";
import { GLOBALS } from "../globals.js";
import { Observer } from "../utils/observer.js";
import { getGenerationStorage, saveGeneration } from "../utils/population-io.js";
import { Population } from './core/population.js';
import { computeFitness } from "./fitness.js";
import { GameNN } from './game-nn.js';
import { PaddleNN } from "./paddle-nn.js";
export class AITrainer extends MultiGameController {
    constructor(tableWith, tableHeight) {
        super(tableWith, tableHeight, GLOBALS.population.pairs);
        this.neuralNetworks = [];
        this.observer = new Observer();
        this.loadPopulation();
    }
    onAllGamesFinish() {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i];
            const complexity = game.calcComplexity();
            game.getPaddleLeft().network.fitness = computeFitness(game.getPaddleLeft().statistics) * complexity;
            game.getPaddleRight().network.fitness = computeFitness(game.getPaddleRight().statistics) * complexity;
        }
        const best = this.population.getBestIndividual();
        this.population.nextGeneration(GLOBALS.evolution);
        this.neuralNetworks = this.population.individuals.map(network => network);
        saveGeneration({ population: this.population, best });
        this.startGames();
        this.observer.emit('next-generation', undefined);
    }
    createInstanceGame() {
        const game = new GameNN(this.tableWith, this.tableHeight, new PaddleNN(10, 100, this.tableWith, this.tableHeight, TableSide.LEFT), new PaddleNN(10, 100, this.tableWith, this.tableHeight, TableSide.RIGHT));
        game.on('game/start', () => {
            const [networkLeft] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1);
            const [networkRight] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1);
            game.setNeuralNetworkLeft(networkLeft);
            game.setNeuralNetworkRight(networkRight);
        });
        return game;
    }
    loadPopulation() {
        this.population = AITrainer.getGeneration();
        this.neuralNetworks = this.population.individuals.map(network => network);
    }
    on(event, handler) {
        return this.observer.on(event, handler);
    }
    clearListener(event, id) {
        this.observer.clearListener(event, id);
    }
    clearAllListeners() {
        this.observer.clearAllListeners();
    }
    clearListenersByEvent(event) {
        this.observer.clearListenersByEvent(event);
    }
    static getGeneration() {
        const populationStorage = getGenerationStorage();
        if (populationStorage) {
            console.log('Load population from Storage');
            return populationStorage;
        }
        console.log('Create new Population');
        const population = Population.createPopulation(GLOBALS.population.pairs * 2, GLOBALS.network.structure, GLOBALS.network.activations);
        population.randomize(-GLOBALS.network.rateInitialRandomInterval, GLOBALS.network.rateInitialRandomInterval);
        return population;
    }
}
//# sourceMappingURL=ai-trainer.js.map