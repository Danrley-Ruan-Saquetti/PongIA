import { GameView } from "./game/game-view.js";
import { Game } from "./game/game.js";
import { PaddleBot } from './game/paddle-bot.js';
import { TableSide } from './game/types.js';
import { GLOBALS } from "./globals.js";
import { PaddlePlayer } from './player/paddle-player.js';
import { resizeCanvas } from "./utils/utils.js";
window.onload = app;
function app() {
    const canvasGame = document.getElementById("gameCanvas");
    resizeCanvas(canvasGame, GLOBALS.game.table);
    const game = new Game(canvasGame.width, canvasGame.height, new PaddlePlayer(100, 100, canvasGame.width, canvasGame.height, TableSide.LEFT, 'w', 's'), new PaddleBot(100, 100, canvasGame.width, canvasGame.height, TableSide.RIGHT));
    const gameView = new GameView(canvasGame);
    game.options.limitTime = 1000 * 60;
    gameView.setGame(game);
    game.start();
    gameView.start();
}
//# sourceMappingURL=player-bot.js.map