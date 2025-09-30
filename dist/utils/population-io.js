import { GLOBALS } from "../globals.js";
import { NeuralNetwork } from "../nn/core/neural-network.js";
import { Population } from "../nn/core/population.js";
export function saveGeneration({ population, best }) {
    if (!GLOBALS.storage.enable) {
        return;
    }
    const updatedAt = new Date(Date.now());
    console.log('Population saved', updatedAt.toLocaleString('pt-BR'));
    localStorage.setItem('population.updated_at', JSON.stringify(updatedAt));
    localStorage.setItem('population.generation', `${population.getCurrentGeneration()}`);
    localStorage.setItem('population', JSON.stringify(population.toJSON()));
    const bestFitnessStorage = +localStorage.getItem('population.best-fitness') || 0;
    if (best && best.fitness >= bestFitnessStorage) {
        localStorage.setItem('population.best-individual', JSON.stringify(best.toJSON()));
        localStorage.setItem('population.best-fitness', JSON.stringify(best.fitness));
    }
}
export function getGenerationStorage() {
    if (!GLOBALS.storage.enable) {
        return null;
    }
    const populationStorage = JSON.parse(localStorage.getItem('population'));
    const generation = JSON.parse(localStorage.getItem('population.generation'));
    if (!populationStorage) {
        return null;
    }
    return Population.from(populationStorage, GLOBALS.network.activations, Number(generation) || 1);
}
export function getBestIndividualStorage() {
    if (!GLOBALS.storage.enable) {
        return null;
    }
    const individualStorage = JSON.parse(localStorage.getItem('population.best-individual'));
    if (!individualStorage) {
        return null;
    }
    const bestFitnessStorage = +localStorage.getItem('population.best-fitness') || 0;
    return NeuralNetwork.from(individualStorage, GLOBALS.network.activations, bestFitnessStorage);
}
export function clearStorage() {
    localStorage.removeItem('population.updated_at');
    localStorage.removeItem('population.generation');
    localStorage.removeItem('population');
    localStorage.removeItem('population.best-individual');
    localStorage.removeItem('population.best-fitness');
}
//# sourceMappingURL=population-io.js.map