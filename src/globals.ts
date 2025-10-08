import { GameOptions } from "./game/types";

const GAME_OPTIONS_DEFAULT: GameOptions = {
  limitTime: 1000 * 20,
  speedTime: 1,
  maxScore: 5,
  rounds: 5,
}

export const GLOBALS = {
  game: {
    options: GAME_OPTIONS_DEFAULT,
    table: {
      width: 800,
      height: 350
    },
  },
  evolution: {
    gameOptions: {
      ...GAME_OPTIONS_DEFAULT,
      limitTime: 1000 * 30,
      speedTime: 5,
      maxScore: 5,
      rounds: 3,
    },
    mutationRate: .1,
    mutationStrength: .05,
    rateDeath: .3,
    fitness: {
      score: 5,
      scoresByAttack: 10,
      ballsLost: -5,
      rallyInitiated: 1,
      totalRallySequence: 2,
      longestRallySequence: 10,
      anticipationTimes: 5,
      avgRally: 6,
      penaltyNoSequence: -20
    }
  },
  population: {
    size: 100
  },
  network: {
    structure: [5, 8, 8, 3],
    activations: [
      (x: number) => Math.tanh(x),
      (x: number) => Math.tanh(x),
      (x: number) => Math.tanh(x),
    ],
    rateWeightsInitialInterval: {
      min: -1,
      max: 1
    },
    rateBiasesInitialInterval: {
      min: 0,
      max: .1
    },
  },
  storage: {
    enable: false
  }
}
