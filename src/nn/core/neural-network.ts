import { ActivationFunction, Layer } from "./layer.js"

export class NeuralNetwork {

  fitness = 0

  constructor(public layers: Layer[]) { }

  static create(structure: number[], activations: ActivationFunction[]) {
    return new NeuralNetwork(
      Array
        .from<Layer>({ length: structure.length - 1 })
        .map((_, i) => Layer.createLayer(structure[i], structure[i + 1], activations[i]))
    )
  }

  static from(layersRaw: { weights: number[][], biases: number[] }[], activations: ActivationFunction[]) {
    const layers = Array.from({ length: layersRaw.length }).map((_, i) => {
      return new Layer(layersRaw[i].weights, layersRaw[i].biases, activations[i])
    })

    return new NeuralNetwork(layers)
  }

  randomize(min: number, max: number) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].randomize(min, max)
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
