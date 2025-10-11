import { Observer } from '../utils/observer.js';
import { Vector2D } from './../utils/vector2d.js';
import { GameEntity } from './game-entity.js';
import { TableSide } from './types.js';
export class Ball extends GameEntity {
    get speedMultiplier() { return this._speedMultiplier; }
    get finalY() { return this._finalY; }
    constructor(radius) {
        super();
        this.radius = radius;
        this.GAP_FINAL_Y = 4;
        this.MAX_SPEED = new Vector2D(6, 4);
        this.MAX_MULTIPLIER = 2;
        this.SPEED_MULTIPLIER_INCREASE_PER_HIT = .25;
        this._speedMultiplier = 1;
        this.isBallEnableToHit = false;
        this.renderFinalTarget = false;
        this.observer = new Observer();
        this.speed = new Vector2D();
    }
    onStartGame() { }
    onStartRound() {
        this.reset();
    }
    reset() {
        this.restartBall();
    }
    restartBall() {
        this.isBallEnableToHit = false;
        this.position.x = this.table.dimension.width / 2;
        this.position.y = this.table.dimension.height / 2;
        this.speed.x = this.MAX_SPEED.x * -1;
        this.speed.y = this.MAX_SPEED.y * (Math.random() > 0.5 ? 1 : -1);
        this._speedMultiplier = 1;
        this._finalY = this.predictFinalY();
    }
    update(paddleLeft, paddleRight) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.isBallEnableToHit = this.isCrossedTable();
        if (this.position.y - this.radius < 0 || this.position.y + this.radius > this.table.dimension.height) {
            this.speed.y *= -1;
            if (this.position.y - this.radius < 0) {
                this.position.y = this.radius;
            }
            else {
                this.position.y = this.table.dimension.height - this.radius;
            }
        }
        if (this.checkCollisionPaddle(paddleLeft)) {
            this.handleCollision(paddleLeft);
        }
        else if (this.checkCollisionPaddle(paddleRight)) {
            this.handleCollision(paddleRight);
        }
        if (this.position.x < 0) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.LEFT);
        }
        if (this.position.x > this.table.dimension.width) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.RIGHT);
        }
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        const finalX = this.speed.x > 0 ? this.table.dimension.width - (this.radius * this.GAP_FINAL_Y) : this.radius * this.GAP_FINAL_Y;
        if (this.renderFinalTarget) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(finalX, this._finalY, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    isCrossedTable() {
        if (this.speed.x > 0) {
            return this.position.x >= this.table.dimension.width / 2;
        }
        return this.position.x <= this.table.dimension.width / 2;
    }
    isBallIntoSide(side) {
        if (side == TableSide.RIGHT) {
            return this.speed.x > 0;
        }
        return this.speed.x < 0;
    }
    checkCollisionPaddle(paddle) {
        const closestX = Math.max(paddle.position.x, Math.min(this.position.x, paddle.position.x + paddle.dimension.width));
        const closestY = Math.max(paddle.position.y, Math.min(this.position.y, paddle.position.y + paddle.dimension.height));
        const dx = this.position.x - closestX;
        const dy = this.position.y - closestY;
        return (dx * dx + dy * dy) < (this.radius * this.radius);
    }
    handleCollision(paddle) {
        if (!this.isBallEnableToHit) {
            return;
        }
        const paddleCenterX = paddle.position.x + paddle.dimension.width / 2;
        const paddleCenterY = paddle.position.y + paddle.dimension.height / 2;
        const dx = this.position.x - paddleCenterX;
        const dy = this.position.y - paddleCenterY;
        const absDX = Math.abs(dx);
        const absDY = Math.abs(dy);
        if (absDX > absDY) {
            this.collisionPaddle(paddle);
        }
        else {
            this.speed.y *= -1;
        }
    }
    collisionPaddle(paddle) {
        paddle.onBallHit();
        if (this._speedMultiplier < this.MAX_MULTIPLIER) {
            this._speedMultiplier += this.SPEED_MULTIPLIER_INCREASE_PER_HIT;
        }
        this._finalY = this.predictFinalY();
    }
    predictFinalY() {
        const finaX = this.speed.x > 0 ? this.table.dimension.width - (this.radius * this.GAP_FINAL_Y) : this.radius * this.GAP_FINAL_Y;
        const speedX = this.speed.x;
        const speedY = this.speed.y;
        const deltaX = (finaX - this.position.x) / speedX;
        if (deltaX < 0) {
            return this.position.y;
        }
        const rawY = this.position.y + speedY * deltaX;
        const effectiveHeight = this.table.dimension.height - this.radius * 2;
        const offset = this.radius;
        const period = 2 * effectiveHeight;
        const modY = ((rawY - offset) % period + period) % period;
        const _finalY = modY <= effectiveHeight
            ? modY + offset
            : effectiveHeight - (modY - effectiveHeight) + offset;
        return _finalY;
    }
    setTable(table) {
        this.table = table;
    }
    on(event, handler) {
        return this.observer.on(event, handler);
    }
    clearListener(event, id) {
        this.observer.clearListener(event, id);
    }
    clearAllListeners() {
        this.observer.clearAllListeners();
    }
    clearListenersByEvent(event) {
        this.observer.clearListenersByEvent(event);
    }
}
//# sourceMappingURL=ball.js.map