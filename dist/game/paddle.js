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
        this.statistics = {
            score: 0,
            ballsLost: 0,
            scoresByAttack: 0,
            rallySequence: 0,
            rallyInitiated: 0,
            longestRallySequence: 0,
            totalRallySequence: 0,
            anticipationTimes: 0,
        };
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
        this.position = new Vector2D();
        if (side == TableSide.LEFT) {
            this.position.x = 20;
        }
        else {
            this.position.x = this.tableWidth - 30;
        }
    }
    reset() {
        this.position.y = (this.tableHeight / 2) - (this.height / 2);
        this.statistics = {
            score: 0,
            ballsLost: 0,
            scoresByAttack: 0,
            rallySequence: 0,
            rallyInitiated: 0,
            longestRallySequence: 0,
            totalRallySequence: 0,
            anticipationTimes: 0,
        };
        this.isMoveForAttack = false;
        this.isCounteredBall = false;
        this.isAnticipated = false;
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
        else {
            if (this.ball.isCrossedTable()) {
                this.isAnticipated = false;
            }
        }
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
        const speed = Math.sqrt(this.ball.speed.x * this.ball.speed.x + this.ball.speed.y * this.ball.speed.y);
        this.ball.speed.y = speed * Math.sin(bounceAngle);
        if (this.side === TableSide.LEFT) {
            this.ball.speed.x = Math.abs(speed * Math.cos(bounceAngle));
        }
        else {
            this.ball.speed.x = -Math.abs(speed * Math.cos(bounceAngle));
        }
    }
    nextRally() {
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
}
//# sourceMappingURL=paddle.js.map