import { ActivationFunction } from './layer.js'
import { NeuralNetwork } from './neural-network.js'

export class Population {

  private currentGeneration = 1
  private recordFitness = 0
  private avgFitness = 0

  constructor(public individuals: NeuralNetwork[]) { }

  static createPopulation(size: number, structure: number[], activations: ActivationFunction[]) {
    return new Population(Array.from<NeuralNetwork>({ length: size }).map(() => NeuralNetwork.create(structure, activations)))
  }

  static from(neuralNetworks: { weights: number[][], biases: number[] }[][], activations: ActivationFunction[], initiateGeneration = 1) {
    const individuals = Array.from({ length: neuralNetworks.length }).map((_, i) => NeuralNetwork.from(neuralNetworks[i], activations))

    const population = new Population(individuals)

    population.currentGeneration = initiateGeneration

    return population
  }

  nextGeneration(options: { mutationRate: number, mutationStrength: number, rateDeath: number }) {
    const individuals = this.individuals.sort((networkA, networkB) => networkB.fitness - networkA.fitness)

    if (this.recordFitness < individuals[0].fitness) {
      this.recordFitness = individuals[0].fitness
    }

    this.avgFitness = individuals.length > 0 ? individuals.reduce((acc, { fitness }) => acc + fitness, 0) / individuals.length : 0

    const newIndividuals: NeuralNetwork[] = []

    const eliteCount = Math.floor(this.individuals.length * (1 - options.rateDeath))

    for (let i = 0; i < eliteCount; i++) {
      individuals[i].fitness = 0

      newIndividuals.push(individuals[i])
    }

    const minFitness = individuals[eliteCount - 1].fitness

    while (newIndividuals.length < this.individuals.length) {
      const partnerA = this.tournamentSelect(minFitness)
      const partnerB = this.tournamentSelect(minFitness)

      const child = partnerA.crossover(partnerB)

      child.mutation(options.mutationRate, options.mutationStrength)

      newIndividuals.push(child)
    }

    this.currentGeneration++
    this.individuals = newIndividuals
  }

  private tournamentSelect(minFitness = 0) {
    let bestIndividual: NeuralNetwork = null!

    for (let i = 0; i < 3; i++) {
      const individual = this.individuals[Math.floor(Math.random() * this.individuals.length)]

      if (individual.fitness < minFitness) {
        i--
        continue
      }

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

  getBestIndividual() {
    return this.individuals.sort((networkA, networkB) => networkB.fitness - networkA.fitness)[0]
  }

  getRecordFitness() {
    return this.recordFitness
  }

  getAvgFitness() {
    return this.avgFitness
  }

  getCurrentGeneration() {
    return this.currentGeneration
  }

  toJSON() {
    return this.individuals.map(network => network.toJSON())
  }
}
