import { NeuralNetwork } from './neural-network.js';
import { ActivationFunction } from './layer.js';

export class Population {

  private currentGeneration = 1
  private recordFitness = 0

  constructor(public individuals: NeuralNetwork[]) { }

  static createPopulation(size: number, structure: number[], activation: ActivationFunction) {
    return new Population(Array.from<NeuralNetwork>({ length: size }).map(() => NeuralNetwork.create(structure, activation)))
  }

  static from(neuralNetworks: { weights: number[][], biases: number[] }[][], activation: ActivationFunction) {
    const individuals = Array.from({ length: neuralNetworks.length }).map((_, i) => NeuralNetwork.from(neuralNetworks[i], activation))

    return new Population(individuals)
  }

  nextGeneration(options: { mutationRate: number, mutationStrength: number, rateDeath: number }) {
    const individuals = this.individuals.sort((networkA, networkB) => networkB.fitness - networkA.fitness)

    if (this.recordFitness < individuals[0].fitness) {
      this.recordFitness = individuals[0].fitness
    }

    const newIndividuals: NeuralNetwork[] = []

    const eliteCount = Math.floor(this.individuals.length * (1 - options.rateDeath))

    for (let i = 0; i < eliteCount; i++) {
      newIndividuals.push(individuals[i].clone());
    }

    while (newIndividuals.length < this.individuals.length) {
      const partnerA = this.tournamentSelect()
      const partnerB = this.tournamentSelect()

      const child = partnerA.crossover(partnerB)

      child.mutation(options.mutationRate, options.mutationStrength)

      newIndividuals.push(child)
    }

    this.currentGeneration++
    this.individuals = newIndividuals
  }

  private tournamentSelect() {
    let bestIndividual: NeuralNetwork = null!

    for (let i = 0; i < 3; i++) {
      const individual = this.individuals[Math.floor(Math.random() * this.individuals.length)]

      if (!bestIndividual || bestIndividual.fitness < individual.fitness) {
        bestIndividual = individual
      }
    }

    return bestIndividual
  }

  randomize(min: number, max: number) {
    for (let i = 0; i < this.individuals.length; i++) {
      this.individuals[i].randomize(min, max)
    }
  }

  getRecordFitness() {
    return this.recordFitness
  }

  getCurrentGeneration() {
    return this.currentGeneration
  }

  toJSON() {
    return this.individuals.map(network => network.toJSON())
  }
}
