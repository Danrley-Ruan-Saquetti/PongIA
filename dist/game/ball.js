import { Observer } from '../utils/observer.js';
import { Vector2D } from './../utils/vector2d.js';
import { GameEntity } from './game-entity.js';
import { TableSide } from './types.js';
export class Ball extends GameEntity {
    get speedMultiplier() { return this._speedMultiplier; }
    get finalY() { return this._finalY; }
    get positionInitialX() { return this.position.x - this.radius; }
    get positionInitialY() { return this.position.y - this.radius; }
    get positionFinalX() { return this.position.x + this.radius; }
    get positionFinalY() { return this.position.y + this.radius; }
    constructor(radius) {
        super();
        this.radius = radius;
        this.GAP_FINAL_Y = 20;
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
        this.position.x = this.table.position.x;
        this.position.y = this.table.position.y;
        this.speed.x = this.MAX_SPEED.x * (Math.random() > 0.5 ? 1 : -1);
        this.speed.y = this.MAX_SPEED.y * (Math.random() > 0.5 ? 1 : -1);
        this._speedMultiplier = 1;
        this._finalY = this.predictFinalY();
    }
    update(paddleLeft, paddleRight) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.isBallEnableToHit = this.isCrossedTable();
        if (this.positionInitialY < this.table.positionInitialY || this.positionFinalY > this.table.positionFinalY) {
            this.speed.y *= -1;
        }
        this.fixPosition();
        if (this.checkCollisionPaddle(paddleLeft)) {
            this.collisionPaddle(paddleLeft);
            // this.handleCollision(paddleLeft)
        }
        else if (this.checkCollisionPaddle(paddleRight)) {
            this.collisionPaddle(paddleRight);
            // this.handleCollision(paddleRight)
        }
        if (this.positionFinalX < this.table.positionInitialX) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.LEFT);
        }
        if (this.positionInitialX > this.table.positionFinalX) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.RIGHT);
        }
    }
    fixPosition() {
        if (this.positionInitialY < this.table.positionInitialY) {
            this.position.y = this.table.positionInitialY + this.radius;
        }
        else if (this.positionFinalY > this.table.positionFinalY) {
            this.position.y = this.table.positionFinalY - this.radius;
        }
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        if (this.renderFinalTarget) {
            const finalX = this.speed.x > 0 ? this.table.positionFinalX - this.GAP_FINAL_Y : this.table.positionInitialX + this.GAP_FINAL_Y;
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
            return this.position.x >= this.table.position.x;
        }
        return this.position.x <= this.table.position.x;
    }
    isBallIntoSide(side) {
        if (side == TableSide.RIGHT) {
            return this.speed.x > 0;
        }
        return this.speed.x < 0;
    }
    checkCollisionPaddle(paddle) {
        const closestX = Math.max(paddle.positionInitialX, Math.min(this.position.x, paddle.positionFinalX));
        const closestY = Math.max(paddle.positionInitialY, Math.min(this.position.y, paddle.positionFinalY));
        const dx = this.position.x - closestX;
        const dy = this.position.y - closestY;
        return (dx * dx + dy * dy) < (this.radius * this.radius);
    }
    handleCollision(paddle) {
        if (!this.isBallEnableToHit) {
            return;
        }
        const dx = this.position.x - paddle.positionFinalX;
        const dy = this.position.y - paddle.positionFinalY;
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
        const halfWidth = this.table.halfWidth;
        const halfHeight = this.table.halfHeight;
        // destino em X (direita ou esquerda)
        const finalX = this.speed.x > 0
            ? halfWidth - this.GAP_FINAL_Y
            : -halfWidth + this.GAP_FINAL_Y;
        const speedX = this.speed.x;
        const speedY = this.speed.y;
        const deltaX = (finalX - this.position.x) / speedX;
        if (deltaX < 0) {
            return this.position.y;
        }
        const rawY = this.position.y + speedY * deltaX;
        // altura útil (sem os limites do raio)
        const effectiveHeight = this.table.dimension.height - this.radius * 2;
        const halfEffective = effectiveHeight / 2;
        // período refletido no espaço [-halfEffective, +halfEffective]
        const period = 2 * effectiveHeight;
        const modY = ((rawY + halfEffective) % period + period) % period;
        const reflectedY = modY <= effectiveHeight
            ? modY - halfEffective
            : effectiveHeight - (modY - effectiveHeight) - halfEffective;
        // compensar deslocamento do raio
        return Math.max(-halfHeight + this.radius, Math.min(halfHeight - this.radius, reflectedY));
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