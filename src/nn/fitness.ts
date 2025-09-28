import { GLOBALS } from '../globals.js'
import { PaddleStatistics } from './../game/paddle.js'

export function computeFitness(stats: PaddleStatistics) {
  let fitness = 0

  fitness += stats.score * GLOBALS.evolution.fitness.score

  fitness += stats.scoresByAttack * GLOBALS.evolution.fitness.scoresByAttack

  fitness -= stats.ballsLost * GLOBALS.evolution.fitness.ballsLost

  fitness += stats.rallyInitiated * GLOBALS.evolution.fitness.rallyInitiated

  fitness += stats.totalRallySequence * GLOBALS.evolution.fitness.totalRallySequence

  fitness += stats.longestRallySequence * GLOBALS.evolution.fitness.longestRallySequence

  fitness += stats.anticipationTimes * GLOBALS.evolution.fitness.anticipationTimes

  const avgRally =
    stats.rallyInitiated > 0
      ? stats.totalRallySequence / stats.rallyInitiated
      : 0

  fitness += avgRally * GLOBALS.evolution.fitness.avgRally

  return fitness
}
