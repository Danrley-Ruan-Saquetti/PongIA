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
        this.ctx.save();
        const table = this.game.getTable();
        const ball = this.game.getBall();
        const paddleLeft = this.game.getPaddleLeft();
        const paddleRight = this.game.getPaddleRight();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(table.halfWidth, table.halfHeight);
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 10]);
        this.ctx.moveTo(table.position.x, table.positionInitialY);
        this.ctx.lineTo(table.position.x, table.positionFinalY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        paddleLeft.draw(this.ctx);
        paddleRight.draw(this.ctx);
        ball.draw(this.ctx);
        this.ctx.fillStyle = '#FFF';
        this.ctx.textAlign = "center";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${this.game.id}`, table.positionInitialX + 100, table.positionInitialY + 30);
        this.ctx.fillStyle = this.game.FPS >= this.game.FPS_LOCKED ? '#64f22dff' : this.game.FPS < this.game.FPS_LOCKED - 20 ? '#FF0000' : '#3870fdff';
        this.ctx.font = "15px Arial";
        this.ctx.fillText(`${this.game.FPS}FPS`, table.positionInitialX + 200, table.positionInitialY + 25);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(`${this.game.duration.toFixed(1)}s`, table.position.x + 100, table.positionInitialY + 30);
        this.ctx.fillText(`${paddleLeft.statistics.score} - ${paddleRight.statistics.score}`, table.position.x, table.positionInitialY + 30);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`${paddleLeft.accStatistics.roundVictories} - ${paddleRight.accStatistics.roundVictories}`, table.position.x, table.positionInitialY + 60);
        this.ctx.font = "30px Arial";
        if (!this.game.isRunning) {
            if (paddleLeft.accStatistics.roundVictories > paddleRight.accStatistics.roundVictories) {
                this.ctx.fillText(`Winner`, table.positionInitialX + table.dimension.width / 4, table.positionInitialY + table.dimension.height / 2);
            }
            else if (paddleLeft.accStatistics.roundVictories < paddleRight.accStatistics.roundVictories) {
                this.ctx.fillText(`Winner`, table.positionInitialX + (table.dimension.width / 4) * 3, table.positionInitialY + table.dimension.height / 2);
            }
            else {
                this.ctx.fillText(`Draw`, table.positionInitialX + table.dimension.width / 4, table.positionInitialY + table.dimension.height / 2);
                this.ctx.fillText(`Draw`, table.positionInitialX + (table.dimension.width / 4) * 3, table.positionInitialY + table.dimension.height / 2);
            }
        }
        this.ctx.restore();
    }
    setGame(game) {
        this.game = game;
    }
}
//# sourceMappingURL=game-view.js.map