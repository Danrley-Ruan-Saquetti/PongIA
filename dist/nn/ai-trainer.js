import { MultiGameController } from "../game/multi-game-controller.js";
import { PaddleBot } from "../game/paddle-bot.js";
import { GLOBALS } from "../globals.js";
import { Observer } from "../utils/observer.js";
import { getGenerationStorage, saveGeneration } from "../utils/population-io.js";
import { Population } from './core/population.js';
import { computeFitness } from "./fitness.js";
import { GameNN } from './game-nn.js';
import { PaddleNN } from "./paddle-nn.js";
export class AITrainer extends MultiGameController {
    constructor(table) {
        super(table, GLOBALS.population.size);
        this.neuralNetworks = [];
        this.observer = new Observer();
        this.loadPopulation();
    }
    onAllGamesFinish() {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i];
            const complexity = game.calcComplexity();
            const fitness = computeFitness(game.getPaddleNeuralNetwork().getAvgStatistics());
            game.getPaddleNeuralNetwork().network.fitness = fitness > 0 ? fitness * complexity : fitness * (1 + complexity);
        }
        const bestIndividual = this.population.getBestIndividual();
        const best = bestIndividual.clone();
        best.fitness = bestIndividual.fitness;
        this.population.nextGeneration(GLOBALS.evolution);
        this.neuralNetworks = this.population.individuals.map(network => network);
        if (GLOBALS.storage.enable) {
            saveGeneration({ population: this.population, best });
        }
        this.startGames();
        this.observer.emit('next-generation', undefined);
    }
    createInstanceGame() {
        const game = new GameNN(this.table);
        game.setPaddles(new PaddleNN(), new PaddleBot());
        game.options = Object.assign({}, GLOBALS.evolution.gameOptions);
        game.on('game/start', () => {
            const [networkLeft] = this.neuralNetworks.splice(Math.floor(Math.random() * this.neuralNetworks.length), 1);
            game.setNeuralNetwork(networkLeft);
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
        const populationStorage = GLOBALS.storage.enable ? getGenerationStorage() : null;
        if (populationStorage) {
            console.log('Load population from Storage');
            return populationStorage;
        }
        console.log('Create new Population');
        const population = Population.createPopulation(GLOBALS.population.size, GLOBALS.network.structure, GLOBALS.network.activations);
        population.randomizeWeights(GLOBALS.network.rateWeightsInitialInterval.min, GLOBALS.network.rateWeightsInitialInterval.max);
        population.randomizeBiases(GLOBALS.network.rateBiasesInitialInterval.min, GLOBALS.network.rateBiasesInitialInterval.max);
        return population;
    }
}
//# sourceMappingURL=ai-trainer.js.map