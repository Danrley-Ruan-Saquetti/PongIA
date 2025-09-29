import { GLOBALS } from '../globals.js';
export function computeFitness(stats) {
    let fitness = 0;
    fitness += stats.score * GLOBALS.evolution.fitness.score;
    fitness += stats.scoresByAttack * GLOBALS.evolution.fitness.scoresByAttack;
    fitness += stats.ballsLost * GLOBALS.evolution.fitness.ballsLost;
    fitness += stats.rallyInitiated * GLOBALS.evolution.fitness.rallyInitiated;
    if (stats.totalRallySequence > 0) {
        fitness += stats.totalRallySequence * GLOBALS.evolution.fitness.totalRallySequence;
    }
    else {
        fitness += GLOBALS.evolution.fitness.penaltyNoSequence;
    }
    fitness += stats.longestRallySequence * GLOBALS.evolution.fitness.longestRallySequence;
    fitness += stats.anticipationTimes * GLOBALS.evolution.fitness.anticipationTimes;
    const avgRally = stats.rallyInitiated > 0
        ? stats.totalRallySequence / stats.rallyInitiated
        : 0;
    fitness += avgRally * GLOBALS.evolution.fitness.avgRally;
    return fitness;
}
//# sourceMappingURL=fitness.js.map