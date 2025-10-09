import { Vector2D } from "../utils/vector2d.js";
import { TableSide } from "./types.js";
export class Paddle {
    constructor(width, height, tableWidth, tableHeight, side) {
        this.width = width;
        this.height = height;
        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.side = side;
        this.speed = 6;
        this.color = 'white';
        this.statistics = Paddle.getDefaultStatistics();
        this.accStatistics = Paddle.getDefaultStatistics();
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.inSequence = false;
        this.position = new Vector2D();
        if (side == TableSide.LEFT) {
            this.position.x = 20;
        }
        else {
            this.position.x = this.tableWidth - 30;
        }
    }
    static getDefaultStatistics() {
        return {
            countRounds: 0,
            roundVictories: 0,
            score: 0,
            ballsLost: 0,
            scoresByAttack: 0,
            rallySequence: 0,
            rallyInitiated: 0,
            longestRallySequence: 0,
            totalRallySequence: 0,
            anticipationTimes: 0,
        };
    }
    onStartGame() {
        this.accStatistics = Paddle.getDefaultStatistics();
        this.statistics = Paddle.getDefaultStatistics();
    }
    onStartRound() {
        this.accStatistics.score += this.statistics.score;
        this.accStatistics.ballsLost += this.statistics.ballsLost;
        this.accStatistics.scoresByAttack += this.statistics.scoresByAttack;
        this.accStatistics.rallySequence += this.statistics.rallySequence;
        this.accStatistics.rallyInitiated += this.statistics.rallyInitiated;
        this.accStatistics.longestRallySequence += this.statistics.longestRallySequence;
        this.accStatistics.totalRallySequence += this.statistics.totalRallySequence;
        this.accStatistics.anticipationTimes += this.statistics.anticipationTimes;
        this.accStatistics.countRounds++;
        this.statistics = Paddle.getDefaultStatistics();
        this.reset();
    }
    reset() {
        this.position.y = (this.tableHeight / 2) - (this.height / 2);
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.inSequence = false;
    }
    update() { }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText(`Sequence: ${this.statistics.rallySequence}`, this.position.x + (this.side == TableSide.LEFT ? 150 : -150), this.tableHeight - 15);
    }
    moveUp() {
        this.position.y -= this.speed;
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        else {
            this.onMoved();
        }
    }
    moveDown() {
        this.position.y += this.speed;
        if (this.position.y + this.height > this.tableHeight) {
            this.position.y = this.tableHeight - this.height;
        }
        else {
            this.onMoved();
        }
    }
    onMoved() {
        this.isMoveForAttack = true;
        if (!this.ball.isBallIntoSide(this.side)) {
            return;
        }
        if (this.position.y <= this.ball.finalY && this.ball.finalY <= this.position.y + this.height) {
            if (!this.ball.isCrossedTable()) {
                this.isAnticipated = true;
            }
        }
        else if (this.ball.isCrossedTable()) {
            this.isAnticipated = false;
        }
    }
    onVictory() {
        this.accStatistics.roundVictories++;
    }
    onScore() {
        this.statistics.score++;
        if (this.isCounteredBall) {
            this.statistics.scoresByAttack++;
        }
        this.isAnticipated = false;
        this.isCounteredBall = false;
        this.isMoveForAttack = false;
        this.stopRally();
    }
    onLostBall() {
        this.statistics.ballsLost++;
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.stopRally();
    }
    onBallHit() {
        this.isCounteredBall = this.isMoveForAttack;
        if (this.isAnticipated) {
            this.statistics.anticipationTimes++;
        }
        this.nextRally();
        this.recalculateDirectionSpeedBall();
    }
    recalculateDirectionSpeedBall() {
        const relativeIntersectY = this.ball.position.y - (this.position.y + this.height / 2);
        const normalizedIntersectY = relativeIntersectY / (this.height / 2);
        const maxBounceAngle = Math.PI / 3;
        const bounceAngle = normalizedIntersectY * maxBounceAngle;
        const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.speed.y * this.ball.speed.y);
        this.ball.speed.y = speed * Math.sin(bounceAngle) * this.ball.speedMultiplier;
        if (this.side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier;
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier;
        }
    }
    nextRally() {
        if (!this.inSequence) {
            this.inSequence = true;
            return;
        }
        if (this.statistics.rallySequence == 0) {
            this.statistics.rallyInitiated++;
        }
        this.statistics.rallySequence++;
        this.statistics.totalRallySequence++;
    }
    stopRally() {
        if (this.statistics.rallySequence > this.statistics.longestRallySequence) {
            this.statistics.longestRallySequence = this.statistics.rallySequence;
        }
        this.statistics.rallySequence = 0;
    }
    getAvgStatistics() {
        return {
            countRounds: this.accStatistics.countRounds,
            roundVictories: this.accStatistics.roundVictories / (this.accStatistics.roundVictories || 1),
            score: this.accStatistics.score / (this.accStatistics.roundVictories || 1),
            ballsLost: this.accStatistics.ballsLost / (this.accStatistics.roundVictories || 1),
            scoresByAttack: this.accStatistics.scoresByAttack / (this.accStatistics.roundVictories || 1),
            rallySequence: this.accStatistics.rallySequence / (this.accStatistics.roundVictories || 1),
            rallyInitiated: this.accStatistics.rallyInitiated / (this.accStatistics.roundVictories || 1),
            longestRallySequence: this.accStatistics.longestRallySequence / (this.accStatistics.roundVictories || 1),
            totalRallySequence: this.accStatistics.totalRallySequence / (this.accStatistics.roundVictories || 1),
            anticipationTimes: this.accStatistics.anticipationTimes / (this.accStatistics.roundVictories || 1),
        };
    }
}
//# sourceMappingURL=paddle.js.map