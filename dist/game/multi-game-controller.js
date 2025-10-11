import { Game } from '../game/game.js';
import { ObjectPool } from '../utils/object-pool.js';
import { Table } from './table.js';
export class MultiGameController {
    constructor(table, gameLength) {
        this.table = table;
        this.games = [];
        this.countGamesRunning = 0;
        this.gamePool = new ObjectPool(gameLength, () => this.createGame(), game => this.resetGame(game));
    }
    startGames() {
        this.games.splice(0, this.games.length);
        while (this.gamePool.available() > 0) {
            const game = this.gamePool.acquire();
            game.start();
            this.games.push(game);
            this.countGamesRunning++;
        }
    }
    createGame() {
        const game = this.createInstanceGame();
        game.on('game/stop', () => {
            this.gamePool.release(game);
            this.countGamesRunning--;
            if (this.countGamesRunning == 0) {
                this.onAllGamesFinish();
            }
        });
        return game;
    }
    onAllGamesFinish() { }
    resetGame(game) { }
    createInstanceGame() {
        return new Game(new Table());
    }
    getCountGamesRunning() {
        return this.countGamesRunning;
    }
}
//# sourceMappingURL=multi-game-controller.js.map