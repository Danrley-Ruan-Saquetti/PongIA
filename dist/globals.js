const GAME_OPTIONS_DEFAULT = {
    limitTime: 1000 * 20,
    speedTime: 1,
    maxVictories: 5,
};
export const GLOBALS = {
    game: {
        options: GAME_OPTIONS_DEFAULT,
        table: {
            width: 800,
            height: 350
        },
    },
    evolution: {
        gameOptions: Object.assign(Object.assign({}, GAME_OPTIONS_DEFAULT), { limitTime: 1000 * 30, speedTime: 3, maxVictories: 30 }),
        mutationRate: .1,
        mutationStrength: .2,
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
            (x) => Math.tanh(x),
            (x) => Math.tanh(x),
            (x) => Math.tanh(x),
        ],
        rateInitialRandomInterval: 8,
    },
    storage: {
        enable: true
    }
};
//# sourceMappingURL=globals.js.map