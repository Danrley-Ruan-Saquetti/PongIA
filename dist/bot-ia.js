import { GameView } from "./game/game-view.js";
import { Game } from "./game/game.js";
import { PaddleBot } from "./game/paddle-bot.js";
import { Table } from "./game/table.js";
import { TableSide } from "./game/types.js";
import { GLOBALS } from "./globals.js";
import { NeuralNetwork } from "./nn/core/neural-network.js";
import { PaddleNN } from "./nn/paddle-nn.js";
import { Dimension } from "./utils/dimension.js";
import { getBestIndividualStorage } from "./utils/population-io.js";
import { resizeCanvas } from "./utils/utils.js";
window.onload = app;
function app() {
    const canvasGame = document.getElementById("gameCanvas");
    resizeCanvas(canvasGame, GLOBALS.game.table);
    const table = new Table(new Dimension(canvasGame.width, canvasGame.height));
    const bestIndividual = getBestIndividualStorage() || NeuralNetwork.create(GLOBALS.network.structure, GLOBALS.network.activations);
    const paddleNetworkSide = Math.random() < .5 ? TableSide.LEFT : TableSide.RIGHT;
    const paddleNetwork = new PaddleNN(new Dimension(10, 100), paddleNetworkSide);
    const paddleBot = new PaddleBot(new Dimension(10, 100), paddleNetworkSide == TableSide.LEFT ? TableSide.RIGHT : TableSide.LEFT);
    const game = new Game(table);
    game.setPaddle(paddleNetwork);
    game.setPaddle(paddleBot);
    paddleNetwork.network = bestIndividual;
    game.options.limitTime = 1000 * 60;
    game.options.maxScore = 60;
    const gameView = new GameView(canvasGame);
    gameView.setGame(game);
    game.start();
    gameView.start();
}
//# sourceMappingURL=bot-ia.js.map