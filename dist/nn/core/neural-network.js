import { Layer } from "./layer.js";
export class NeuralNetwork {
    constructor(layers, fitness = 0) {
        this.layers = layers;
        this.fitness = fitness;
    }
    static create(structure, activations) {
        return new NeuralNetwork(Array
            .from({ length: structure.length - 1 })
            .map((_, i) => Layer.createLayer(structure[i], structure[i + 1], activations[i])));
    }
    static from(layersRaw, activations, fitness = 0) {
        const layers = Array.from({ length: layersRaw.length }).map((_, i) => {
            return new Layer(layersRaw[i].weights, layersRaw[i].biases, activations[i]);
        });
        return new NeuralNetwork(layers, fitness);
    }
    randomize(min, max) {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].randomize(min, max);
        }
    }
    feedforward(inputs) {
        let outputs = inputs;
        for (let i = 0; i < this.layers.length; i++) {
            outputs = this.layers[i].feedforward(outputs);
        }
        return outputs;
    }
    crossover(other) {
        const child = this.clone();
        for (let i = 0; i < this.layers.length; i++) {
            child.layers[i].crossover(other.layers[i]);
        }
        return child;
    }
    mutation(rate, intensity) {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].mutation(rate, intensity);
        }
    }
    clone() {
        return new NeuralNetwork(this.layers.map(layer => layer.clone()));
    }
    toJSON() {
        return this.layers.map(layer => layer.toJSON());
    }
}
//# sourceMappingURL=neural-network.js.map