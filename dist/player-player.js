import { GameView } from "./game/game-view.js";
import { Game } from "./game/game.js";
import { Table } from "./game/table.js";
import { GLOBALS } from "./globals.js";
import { PaddlePlayer } from './player/paddle-player.js';
import { Dimension } from "./utils/dimension.js";
import { resizeCanvas } from "./utils/utils.js";
window.onload = app;
function app() {
    const canvasGame = document.getElementById("gameCanvas");
    resizeCanvas(canvasGame, GLOBALS.game.table);
    const table = new Table(new Dimension(canvasGame.width, canvasGame.height));
    const playerA = new PaddlePlayer(new Dimension(10, 100), 'w', 's');
    const playerB = new PaddlePlayer(new Dimension(10, 100), 'ArrowUp', 'ArrowDown');
    const game = new Game(table);
    game.setPaddles(playerA, playerB);
    const gameView = new GameView(canvasGame);
    gameView.setGame(game);
    game.start();
    gameView.start();
}
//# sourceMappingURL=player-player.js.map