import { Vector2D } from '../utils/vector2d.js';
import { RectangleEntity } from './rectangle-entity.js';
import { TableSide } from "./types.js";
export class Paddle extends RectangleEntity {
    get side() { return this._side; }
    constructor(dimension) {
        super(dimension, new Vector2D());
        this.statistics = Paddle.getDefaultStatistics();
        this.accStatistics = Paddle.getDefaultStatistics();
        this.color = 'white';
        this.speed = 6;
        this.typeDirectionBall = 'ANGLE';
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.inSequence = false;
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
        this.position.y = this.table.position.y;
        if (this._side == TableSide.LEFT) {
            this.position.x = this.table.positionInitialX + 20;
        }
        else {
            this.position.x = this.table.positionFinalX - 20;
        }
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
        this.position.y = this.table.position.y;
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.inSequence = false;
    }
    update() { }
    fixPosition() {
        if (this.positionInitialY < this.table.positionInitialY) {
            this.position.y = this.table.positionInitialY + this.dimension.height / 2;
        }
        else if (this.positionFinalY > this.table.positionFinalY) {
            this.position.y = this.table.positionFinalY - this.dimension.height / 2;
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.positionInitialX, this.positionInitialY, this.dimension.width, this.dimension.height);
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText(`Sequence: ${this.statistics.rallySequence}`, this.table.position.x + 200 * (this._side == TableSide.LEFT ? 1 : -1), this.table.positionFinalY - 15);
    }
    moveUp() {
        this.position.y -= this.speed;
        if (this.positionInitialY >= this.table.positionFinalY) {
            this.onMoved();
        }
        this.fixPosition();
    }
    moveDown() {
        this.position.y += this.speed;
        if (this.positionFinalY <= this.table.position.x) {
            this.onMoved();
        }
        this.fixPosition();
    }
    onMoved() {
        this.isMoveForAttack = true;
        if (!this.ball.isBallIntoSide(this._side)) {
            return;
        }
        if (this.positionInitialY <= this.ball.finalY && this.ball.finalY <= this.positionFinalY) {
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
        if (this.typeDirectionBall == 'ANGLE') {
            this.calculateDirectionSpeedBallFromAngle();
        }
        else {
            this.calculateRandomDirectionSpeedBall();
        }
    }
    calculateDirectionSpeedBallFromAngle() {
        const relativeIntersectY = this.ball.position.y - this.position.y;
        const normalizedIntersectY = relativeIntersectY / (this.dimension.height / 2);
        const maxBounceAngle = Math.PI / 3;
        const bounceAngle = normalizedIntersectY * maxBounceAngle;
        const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.speed.y * this.ball.speed.y);
        this.ball.speed.y = speed * Math.sin(bounceAngle) * this.ball.speedMultiplier;
        if (this._side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier;
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(bounceAngle)) * this.ball.speedMultiplier;
        }
    }
    calculateRandomDirectionSpeedBall() {
        const speed = Math.sqrt(this.ball.MAX_SPEED.x * this.ball.MAX_SPEED.x + this.ball.MAX_SPEED.y * this.ball.MAX_SPEED.y);
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
        this.ball.speed.y = speed * Math.sin(angle) * this.ball.speedMultiplier;
        if (this._side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier;
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(angle)) * this.ball.speedMultiplier;
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
    setTable(table) {
        this.table = table;
    }
    setSide(side) {
        this._side = side;
    }
    setBall(ball) {
        this.ball = ball;
    }
    setTypeDirectionBall(type) {
        this.typeDirectionBall = type;
    }
}
//# sourceMappingURL=paddle.js.map