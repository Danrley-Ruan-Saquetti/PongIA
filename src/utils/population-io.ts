import { GLOBALS } from "../globals.js"
import { NeuralNetwork } from "../nn/core/neural-network.js"
import { Population } from "../nn/core/population.js"

export function saveGeneration({ population, best }: { population: Population, best?: NeuralNetwork }) {
  if (!GLOBALS.storage.enable) {
    return
  }

  const updatedAt = new Date(Date.now())

  console.log('Population saved', updatedAt.toLocaleString('pt-BR'))

  localStorage.setItem('population.updated_at', JSON.stringify(updatedAt))
  localStorage.setItem('population.generation', `${population.getCurrentGeneration()}`)
  localStorage.setItem('population', JSON.stringify(population.toJSON()))

  if (best) {
    localStorage.setItem('population.best-individual', JSON.stringify(best.toJSON()))
  }
}

export function getGenerationStorage(): Population | null {
  if (!GLOBALS.storage.enable) {
    return null
  }

  const populationStorage = JSON.parse(localStorage.getItem('population')!)
  const generation = JSON.parse(localStorage.getItem('population.generation')!)

  if (!populationStorage) {
    return null
  }

  return Population.from(populationStorage, GLOBALS.network.activations, Number(generation) || 1)
}

export function getBestIndividualStorage(): NeuralNetwork | null {
  if (!GLOBALS.storage.enable) {
    return null
  }

  const individualStorage = JSON.parse(localStorage.getItem('population.best-individual')!)

  if (!individualStorage) {
    return null
  }

  return NeuralNetwork.from(individualStorage, GLOBALS.network.activations)
}
