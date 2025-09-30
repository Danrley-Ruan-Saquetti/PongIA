import { Observer } from '../utils/observer.js';
import { Vector2D } from './../utils/vector2d.js';
import { TableSide } from './types.js';
export class Ball {
    constructor(radius, tableWidth, tableHeight) {
        this.radius = radius;
        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.alphaSpeed = 1;
        this.GAP_FINAL_Y = 4;
        this.isBallEnableToHit = false;
        this.observer = new Observer();
        this.speed = new Vector2D();
        this.position = new Vector2D();
        this.restartBall();
    }
    reset() {
        this.restartBall();
    }
    restartBall() {
        this.isBallEnableToHit = false;
        this.position.x = this.tableWidth / 2;
        this.position.y = this.tableHeight / 2;
        this.speed.x = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.speed.y = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.alphaSpeed = 1;
        this.finalY = this.predictFinalY();
    }
    update(p1, p2) {
        this.position.x += this.speed.x * this.alphaSpeed;
        this.position.y += this.speed.y * this.alphaSpeed;
        this.isBallEnableToHit = this.isCrossedTable();
        if (this.position.y - this.radius < 0 || this.position.y + this.radius > this.tableHeight) {
            this.speed.y *= -1;
            if (this.position.y - this.radius < 0) {
                this.position.y = this.radius;
            }
            else {
                this.position.y = this.tableHeight - this.radius;
            }
        }
        if (this.position.x - this.radius < p1.position.x + p1.width &&
            this.position.y > p1.position.y &&
            this.position.y < p1.position.y + p1.height) {
            this.collisionPaddle(p1, TableSide.LEFT);
        }
        if (this.position.x + this.radius > p2.position.x &&
            this.position.y > p2.position.y &&
            this.position.y < p2.position.y + p2.height) {
            this.collisionPaddle(p2, TableSide.RIGHT);
        }
        if (this.position.x < 0) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.LEFT);
        }
        if (this.position.x > this.tableWidth) {
            this.restartBall();
            this.observer.emit('ball/table-out', TableSide.RIGHT);
        }
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        const finalX = this.speed.x > 0 ? this.tableWidth - (this.radius * this.GAP_FINAL_Y) : this.radius * this.GAP_FINAL_Y;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(finalX, this.finalY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    isCrossedTable() {
        if (this.speed.x > 0) {
            return this.position.x >= this.tableWidth / 2;
        }
        return this.position.x <= this.tableWidth / 2;
    }
    isBallIntoSide(side) {
        if (side == TableSide.RIGHT) {
            return this.speed.x > 0;
        }
        return this.speed.x < 0;
    }
    collisionPaddle(paddle, side) {
        if (!this.isBallEnableToHit) {
            return;
        }
        paddle.onBallHit();
        if (this.alphaSpeed < 2) {
            this.alphaSpeed += .25;
        }
        this.finalY = this.predictFinalY();
    }
    predictFinalY() {
        const finaX = this.speed.x > 0 ? this.tableWidth - (this.radius * this.GAP_FINAL_Y) : this.radius * this.GAP_FINAL_Y;
        const speedX = this.speed.x * this.alphaSpeed;
        const speedY = this.speed.y * this.alphaSpeed;
        const deltaX = (finaX - this.position.x) / speedX;
        if (deltaX < 0) {
            return this.position.y;
        }
        const rawY = this.position.y + speedY * deltaX;
        const effectiveHeight = this.tableHeight - this.radius * 2;
        const offset = this.radius;
        const period = 2 * effectiveHeight;
        const modY = ((rawY - offset) % period + period) % period;
        const finalY = modY <= effectiveHeight
            ? modY + offset
            : effectiveHeight - (modY - effectiveHeight) + offset;
        return finalY;
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