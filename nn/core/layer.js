export class Layer {
    constructor(weights, biases, activation) {
        this.weights = weights;
        this.biases = biases;
        this.activation = activation;
    }
    static createLayer(inputSize, outputSize, activation) {
        const layer = new Layer(Array.from({ length: outputSize }).fill([]).map(() => Array.from({ length: inputSize }).fill(0)), Array.from({ length: outputSize }).fill(0), activation);
        return layer;
    }
    static from(weights, biases, activation) {
        return new Layer(Array.from({ length: weights.length }).map((_, i) => Array.from(weights[i])), Array.from(biases), activation);
    }
    randomize(min, max) {
        for (let i = 0; i < this.biases.length; i++) {
            this.biases[i] = Math.random() * (max - min) + min;
        }
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                this.weights[i][j] = Math.random() * (max - min) + min;
            }
        }
    }
    feedforward(inputs) {
        const outputs = Array.from({ length: this.biases.length }).fill(0);
        for (let i = 0; i < outputs.length; i++) {
            let total = this.biases[i];
            for (let j = 0; j < inputs.length; j++) {
                total += this.weights[i][j] * inputs[j];
            }
            outputs[i] = this.activation(total);
        }
        return outputs;
    }
    crossover(other) {
        for (let i = 0; i < this.biases.length; i++) {
            if (Math.random() >= .5) {
                this.biases[i] = other.biases[i];
            }
        }
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() >= .5) {
                    this.weights[i][j] = other.weights[i][j];
                }
            }
        }
    }
    mutation(rate, intensity) {
        for (let i = 0; i < this.biases.length; i++) {
            if (Math.random() < rate) {
                this.biases[i] = Math.random() * (intensity + intensity) - intensity;
            }
        }
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() < rate) {
                    this.weights[i][j] = Math.random() * (intensity + intensity) - intensity;
                }
            }
        }
    }
    clone() {
        return new Layer(Array.from({ length: this.weights.length }).map((_, i) => Array.from(this.weights[i])), Array.from(this.biases), this.activation);
    }
    toJSON() {
        return {
            weights: this.weights,
            biases: this.biases,
        };
    }
}
//# sourceMappingURL=layer.js.map