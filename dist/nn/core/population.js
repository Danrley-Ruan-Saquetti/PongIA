import { NeuralNetwork } from './neural-network.js';
export class Population {
    constructor(individuals) {
        this.individuals = individuals;
        this.currentGeneration = 1;
        this.recordFitness = 0;
        this.currentBiggestFitness = 0;
        this.avgFitness = 0;
    }
    static createPopulation(size, structure, activations) {
        return new Population(Array.from({ length: size }).map(() => NeuralNetwork.create(structure, activations)));
    }
    static from(neuralNetworks, activations, initiateGeneration = 1) {
        const individuals = Array.from({ length: neuralNetworks.length }).map((_, i) => NeuralNetwork.from(neuralNetworks[i], activations));
        const population = new Population(individuals);
        population.currentGeneration = initiateGeneration;
        return population;
    }
    nextGeneration(options) {
        const individuals = this.individuals.sort((networkA, networkB) => networkB.fitness - networkA.fitness);
        this.currentBiggestFitness = individuals[0].fitness;
        if (this.recordFitness < this.currentBiggestFitness) {
            this.recordFitness = this.currentBiggestFitness;
        }
        this.avgFitness = individuals.length > 0 ? individuals.reduce((acc, { fitness }) => acc + fitness, 0) / individuals.length : 0;
        const newIndividuals = [];
        const eliteCount = Math.floor(this.individuals.length * (1 - options.rateDeath));
        for (let i = 0; i < eliteCount; i++) {
            individuals[i].fitness = 0;
            newIndividuals.push(individuals[i]);
        }
        const minFitness = individuals[eliteCount - 1].fitness;
        while (newIndividuals.length < this.individuals.length) {
            const partnerA = this.tournamentSelect(minFitness);
            const partnerB = this.tournamentSelect(minFitness);
            const child = partnerA.crossover(partnerB);
            child.mutation(options.mutationRate, options.mutationStrength);
            newIndividuals.push(child);
        }
        this.currentGeneration++;
        this.individuals = newIndividuals;
    }
    tournamentSelect(minFitness = 0) {
        let bestIndividual = null;
        for (let i = 0; i < 3; i++) {
            const individual = this.individuals[Math.floor(Math.random() * this.individuals.length)];
            if (individual.fitness < minFitness) {
                i--;
                continue;
            }
            if (!bestIndividual || bestIndividual.fitness < individual.fitness) {
                bestIndividual = individual;
            }
        }
        return bestIndividual;
    }
    randomize(min, max) {
        for (let i = 0; i < this.individuals.length; i++) {
            this.individuals[i].randomize(min, max);
        }
    }
    getBestIndividual() {
        return this.individuals.sort((networkA, networkB) => networkB.fitness - networkA.fitness)[0];
    }
    getRecordFitness() {
        return this.recordFitness;
    }
    getCurrentBiggestFitness() {
        return this.currentBiggestFitness;
    }
    getAvgFitness() {
        return this.avgFitness;
    }
    getCurrentGeneration() {
        return this.currentGeneration;
    }
    toJSON() {
        return this.individuals.map(network => network.toJSON());
    }
}
//# sourceMappingURL=population.js.map