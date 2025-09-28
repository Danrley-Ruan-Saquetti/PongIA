import { GLOBALS } from "../globals.js"
import { Population } from "../nn/core/population.js"

export function savePopulation(population: Population) {
  if (!GLOBALS.storage.enable) {
    return
  }

  const updatedAt = new Date(Date.now())

  console.log('Population saved', updatedAt.toLocaleString('pt-BR'))

  localStorage.setItem('population', JSON.stringify(population.toJSON()))
  localStorage.setItem('population.updated_at', JSON.stringify(updatedAt))
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
