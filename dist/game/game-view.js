export class GameView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    stop() {
        cancelAnimationFrame(this.animationFrame);
    }
    start() {
        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
    loop() {
        this.updateInternal();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.loop());
    }
    updateInternal() { }
    draw() {
        const state = this.game.getState();
        this.ctx.clearRect(0, 0, state.table.dimension.width, state.table.dimension.height);
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 10]);
        this.ctx.moveTo(state.table.dimension.width / 2, 0);
        this.ctx.lineTo(state.table.dimension.width / 2, state.table.dimension.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        state.left.draw(this.ctx);
        state.right.draw(this.ctx);
        state.ball.draw(this.ctx);
        this.ctx.fillStyle = '#FFF';
        this.ctx.textAlign = "center";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${state.id}`, 100, 30);
        this.ctx.fillStyle = state.fps >= this.game.FPS ? '#64f22dff' : state.fps < this.game.FPS - 20 ? '#FF0000' : '#3870fdff';
        this.ctx.font = "15px Arial";
        this.ctx.fillText(`${state.fps}FPS`, 200, 25);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${state.time.toFixed(1)}s`, (state.table.dimension.width / 2) + 100, 30);
        this.ctx.fillText(`${state.left.statistics.score} - ${state.right.statistics.score}`, state.table.dimension.width / 2, 30);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`${state.left.accStatistics.roundVictories} - ${state.right.accStatistics.roundVictories}`, state.table.dimension.width / 2, 60);
        this.ctx.font = "30px Arial";
        if (!this.game.isRunning) {
            if (this.game.paddleLeft.accStatistics.roundVictories > this.game.paddleRight.accStatistics.roundVictories) {
                this.ctx.fillText(`Winner`, state.table.dimension.width / 4, state.table.dimension.height / 2);
            }
            else if (this.game.paddleLeft.accStatistics.roundVictories < this.game.paddleRight.accStatistics.roundVictories) {
                this.ctx.fillText(`Winner`, (state.table.dimension.width / 4) * 3, state.table.dimension.height / 2);
            }
            else {
                this.ctx.fillText(`Draw`, state.table.dimension.width / 4, state.table.dimension.height / 2);
                this.ctx.fillText(`Draw`, (state.table.dimension.width / 4) * 3, state.table.dimension.height / 2);
            }
        }
    }
    setGame(game) {
        this.game = game;
    }
}
//# sourceMappingURL=game-view.js.map