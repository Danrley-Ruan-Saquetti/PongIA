export type ActivationFunction = (x: number) => number

export class Layer {

  constructor(
    public weights: number[][],
    public biases: number[],
    private activation: ActivationFunction
  ) { }

  static createLayer(inputSize: number, outputSize: number, activation: ActivationFunction) {
    const layer = new Layer(
      Array.from<number[]>({ length: outputSize }).fill([]).map(() => Array.from<number>({ length: inputSize }).fill(0)),
      Array.from<number>({ length: outputSize }).fill(0),
      activation
    )

    return layer
  }

  static from(weights: number[][], biases: number[], activation: ActivationFunction) {
    return new Layer(
      Array.from({ length: weights.length }).map((_, i) => Array.from(weights[i])),
      Array.from(biases),
      activation
    )
  }

  randomize(min: number, max: number) {
    for (let i = 0; i < this.biases.length; i++) {
      this.biases[i] = Math.random() * (max - min) + min
    }

    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        this.weights[i][j] = Math.random() * (max - min) + min
      }
    }
  }

  feedforward(inputs: number[]) {
    const outputs = Array.from<number>({ length: this.biases.length }).fill(0)

    for (let i = 0; i < outputs.length; i++) {
      let total = this.biases[i]

      for (let j = 0; j < inputs.length; j++) {
        total += this.weights[i][j] * inputs[j]
      }

      outputs[i] = this.activation(total)
    }

    return outputs
  }

  crossover(other: Layer) {
    for (let i = 0; i < this.biases.length; i++) {
      if (Math.random() >= .5) {
        this.biases[i] = other.biases[i]
      }
    }

    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        if (Math.random() >= .5) {
          this.weights[i][j] = other.weights[i][j]
        }
      }
    }
  }

  mutation(rate: number, intensity: number) {
    for (let i = 0; i < this.biases.length; i++) {
      if (Math.random() < rate) {
        this.biases[i] = Math.random() * (intensity + intensity) - intensity
      }
    }

    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        if (Math.random() < rate) {
          this.weights[i][j] = Math.random() * (intensity + intensity) - intensity
        }
      }
    }
  }

  clone() {
    return new Layer(
      Array.from({ length: this.weights.length }).map((_, i) => Array.from(this.weights[i])),
      Array.from(this.biases),
      this.activation
    )
  }

  toJSON() {
    return {
      weights: this.weights,
      biases: this.biases,
    }
  }
}
