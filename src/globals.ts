export const GLOBALS = {
  game: {
    limitTime: 1000 * 30,
    maxVictories: 25,
    table: {
      width: 800,
      height: 350
    }
  },
  evolution: {
    mutationRate: .1,
    mutationStrength: .2,
    rateDeath: .2,
    fitness: {
      score: 200,
      scoresByAttack: 150,
      ballsLost: 100,
      rallyInitiated: 30,
      totalRallySequence: 5,
      longestRallySequence: 20,
      anticipationTimes: 50,
      avgRally: 10,
    }
  },
  population: {
    pairs: 100
  },
  network: {
    structure: [5, 8, 8, 3],
    activation: (x: number) => Math.tanh(x),
    rateInitialRandomInterval: 4,
  },
  storage: {
    enable: true
  }
}
