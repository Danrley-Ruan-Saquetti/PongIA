import { GameView } from "./game/game-view.js";
import { Game } from "./game/game.js";
import { PaddleBot } from './game/paddle-bot.js';
import { Table } from "./game/table.js";
import { GLOBALS } from "./globals.js";
import { PaddlePlayer } from './player/paddle-player.js';
import { Dimension } from "./utils/dimension.js";
import { resizeCanvas } from "./utils/utils.js";
window.onload = app;
function app() {
    const canvasGame = document.getElementById("gameCanvas");
    resizeCanvas(canvasGame, GLOBALS.game.table);
    const table = new Table();
    table.dimension = new Dimension(canvasGame.width, canvasGame.height);
    const game = new Game(table);
    const paddlePlayer = new PaddlePlayer('w', 's');
    paddlePlayer.dimension.width = 100;
    game.setPaddles(paddlePlayer, new PaddleBot());
    const gameView = new GameView(canvasGame);
    game.options.limitTime = 1000 * 60;
    gameView.setGame(game);
    game.start();
    gameView.start();
}
//# sourceMappingURL=player-bot.js.map