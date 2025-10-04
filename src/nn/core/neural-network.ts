import { ActivationFunction, Layer } from "./layer.js"

export class NeuralNetwork {

  constructor(public layers: Layer[], public fitness = 0) { }

  static create(structure: number[], activations: ActivationFunction[]) {
    return new NeuralNetwork(
      Array
        .from<Layer>({ length: structure.length - 1 })
        .map((_, i) => Layer.createLayer(structure[i], structure[i + 1], activations[i]))
    )
  }

  static from(layersRaw: { weights: number[][], biases: number[] }[], activations: ActivationFunction[], fitness = 0) {
    const layers = Array.from({ length: layersRaw.length }).map((_, i) => {
      return new Layer(layersRaw[i].weights, layersRaw[i].biases, activations[i])
    })

    return new NeuralNetwork(layers, fitness)
  }

  randomizeWeights(min: number, max: number) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].randomizeWeights(min, max)
    }
  }

  randomizeBiases(min: number, max: number) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].randomizeBiases(min, max)
    }
  }

  feedforward(inputs: number[]) {
    let outputs = inputs

    for (let i = 0; i < this.layers.length; i++) {
      outputs = this.layers[i].feedforward(outputs)
    }

    return outputs
  }

  crossover(other: NeuralNetwork) {
    const child = this.clone()

    for (let i = 0; i < this.layers.length; i++) {
      child.layers[i].crossover(other.layers[i])
    }

    return child
  }

  mutation(rate: number, intensity: number) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].mutation(rate, intensity)
    }
  }

  clone() {
    return new NeuralNetwork(this.layers.map(layer => layer.clone()))
  }

  toJSON() {
    return this.layers.map(layer => layer.toJSON())
  }
}
