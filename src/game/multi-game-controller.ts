import { Game } from '../game/game.js';
import { ObjectPool } from '../utils/object-pool.js';

export class MultiGameController<TGame extends Game> {

  private gamePool: ObjectPool<TGame>
  games: TGame[] = []

  private countGamesRunning = 0

  constructor(
    protected tableWith: number,
    protected tableHeight: number,
    gameLength: number
  ) {
    this.gamePool = new ObjectPool<TGame>(
      gameLength,
      () => this.createGame(),
      game => this.resetGame(game)
    )
  }

  startGames() {
    this.games.splice(0, this.games.length)

    while (this.gamePool.available() > 0) {
      const game = this.gamePool.acquire()

      game.start()

      this.games.push(game)
      this.countGamesRunning++
    }
  }

  private createGame() {
    const game = this.createInstanceGame()

    game.on('game/stop', () => {
      this.gamePool.release(game)

      this.countGamesRunning--

      if (this.countGamesRunning == 0) {
        this.onAllGamesFinish()
      }
    })

    return game
  }

  protected onAllGamesFinish() { }

  private resetGame(game: TGame) {
    game.reset()
  }

  protected createInstanceGame(): TGame {
    return new Game(0, 0) as TGame
  }

  getCountGamesRunning() {
    return this.countGamesRunning
  }
}
