export const GLOBALS = {
  game: {
    limitTime: 1000 * 30,
    maxVictories: 25
  },
  evolution: {
    mutationRate: .1,
    mutationStrength: .2,
    rateDeath: .2
  },
  population: {
    size: 100
  },
  network: {
    structure: [5, 8, 8, 3],
    activation: (x: number) => Math.tanh(x),
    rateInitialRandomInterval: .5,
    fitness: {
      onBallHit: 100,
      onBallLost: -100,
      onFollowBall: .1
    }
  },
  storage: {
    enable: true
  }
}
