export const GLOBALS = {
  game: {
    limitTime: 1000 * 30,
    maxVictories: 30,
    table: {
      width: 800,
      height: 350
    },
    FPS: 60
  },
  evolution: {
    mutationRate: .1,
    mutationStrength: .2,
    rateDeath: .3,
    fitness: {
      score: 5,
      scoresByAttack: 10,
      ballsLost: -5,
      rallyInitiated: 3,
      totalRallySequence: 2.5,
      longestRallySequence: 2,
      anticipationTimes: 5,
      avgRally: 2,
      penaltyNoSequence: -20
    }
  },
  population: {
    pairs: 100
  },
  network: {
    structure: [5, 8, 8, 3],
    activations: [
      (x: number) => Math.tanh(x),
      (x: number) => Math.tanh(x),
      (x: number) => Math.tanh(x),
    ],
    rateInitialRandomInterval: 4,
  },
  storage: {
    enable: true
  }
}
