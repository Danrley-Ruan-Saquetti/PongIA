import { GameView } from "./game/game-view.js";
import { Game } from "./game/game.js";
import { TableSide } from './game/types.js';
import { GLOBALS } from "./globals.js";
import { PaddlePlayer } from './player/paddle-player.js';
import { resizeCanvas } from "./utils/utils.js";
window.onload = app;
function app() {
    const canvasGame = document.getElementById("gameCanvas");
    resizeCanvas(canvasGame, GLOBALS.game.table);
    const game = new Game(canvasGame.width, canvasGame.height, new PaddlePlayer(10, 100, canvasGame.width, canvasGame.height, TableSide.LEFT, 'w', 's'), new PaddlePlayer(10, 100, canvasGame.width, canvasGame.height, TableSide.RIGHT, 'ArrowUp', 'ArrowDown'));
    const gameView = new GameView(canvasGame);
    gameView.setGame(game);
    game.start();
    gameView.start();
}
//# sourceMappingURL=player-player.js.map