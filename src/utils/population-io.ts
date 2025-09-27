import { GLOBALS } from "../globals.js"
import { Population } from "../nn/core/population.js"

export function savePopulation(population: Population) {
  if (GLOBALS.storage) {
    localStorage.setItem('population', JSON.stringify(population.toJSON()))
  }
}

export function getPopulation() {
  const populationStorage = getPopulationStorage()

  return populationStorage
}

export function getPopulationStorage(): Population | null {
  if (!GLOBALS.storage.enable) {
    return null
  }

  const populationStorage = JSON.parse(localStorage.getItem('population')!)

  if (!populationStorage) {
    return null
  }

  return Population.from(populationStorage, x => x)
}
