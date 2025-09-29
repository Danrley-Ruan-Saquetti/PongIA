import { GLOBALS } from '../globals.js';
import { DeltaTime } from '../utils/delta-time.js';
import { Observer } from '../utils/observer.js';
import { generateID } from '../utils/utils.js';
import { Ball } from "./ball.js";
import { TableSide } from './types.js';
export class Game {
    constructor(width, height, paddleLeft, paddleRight) {
        this.width = width;
        this.height = height;
        this.paddleLeft = paddleLeft;
        this.paddleRight = paddleRight;
        this.id = generateID();
        this.deltaTime = new DeltaTime();
        this.isRunning = false;
        this.observer = new Observer();
        this.initComponents();
    }
    initComponents() {
        this.loadBall();
        this.loadPaddles();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.reset();
        this.stopId = setTimeout(() => {
            this.stop();
        }, GLOBALS.game.limitTime);
        this.isRunning = true;
        this.observer.emit('game/start', null);
        this.loopId = setInterval(() => this.loop(), 1000 / GLOBALS.game.FPS);
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        clearTimeout(this.stopId);
        clearInterval(this.loopId);
        this.observer.emit('game/stop', null);
    }
    reset() {
        clearTimeout(this.stopId);
        clearInterval(this.loopId);
        this.isRunning = false;
        this.deltaTime.reset();
        this.ball.reset();
        this.paddleLeft.reset();
        this.paddleRight.reset();
    }
    loadBall() {
        this.ball = new Ball(10, this.width, this.height);
        this.ball.on('ball/table-out', side => {
            this.onScored(this.getReversePaddleBySide(side), this.getPaddleBySide(side));
        });
        this.ball.on('ball/paddle-hit', side => {
            this.onPaddleHitBall(this.getPaddleBySide(side));
        });
    }
    loadPaddles() {
        this.paddleLeft.ball = this.ball;
        this.paddleRight.ball = this.ball;
    }
    loop() {
        this.update();
    }
    update() {
        this.deltaTime.next();
        this.updateInternal();
        this.paddleLeft.update();
        this.paddleRight.update();
        this.ball.update(this.paddleLeft, this.paddleRight);
    }
    calcComplexity() {
        const totalRallies = this.paddleLeft.statistics.totalRallySequence + this.paddleRight.statistics.totalRallySequence;
        const longestRally = Math.max(this.paddleLeft.statistics.longestRallySequence, this.paddleRight.statistics.longestRallySequence);
        const totalScores = this.paddleLeft.statistics.score + this.paddleRight.statistics.score;
        const totalAnticipations = this.paddleLeft.statistics.anticipationTimes + this.paddleRight.statistics.anticipationTimes;
        const rallyDensity = totalRallies / Math.max(1, totalScores + this.paddleLeft.statistics.ballsLost + this.paddleRight.statistics.ballsLost);
        const scoreBalance = 1 - Math.abs(this.paddleLeft.statistics.score - this.paddleRight.statistics.score) / Math.max(1, totalScores);
        let complexity = 0;
        complexity += rallyDensity * .5;
        complexity += (longestRally / 10) * .2;
        complexity += scoreBalance * .2;
        complexity += (totalAnticipations / Math.max(1, totalRallies)) * .1;
        return Math.max(1, complexity);
    }
    moveLeftUp() {
        this.paddleLeft.moveUp();
    }
    moveLeftDown() {
        this.paddleLeft.moveDown();
    }
    moveRightUp() {
        this.paddleRight.moveUp();
    }
    moveRightDown() {
        this.paddleRight.moveDown();
    }
    updateInternal() { }
    onPaddleHitBall(paddle) {
        paddle.onHitBall();
    }
    onScored(paddle, paddleLost) {
        paddle.onScore();
        paddleLost.onLostBall();
        if (paddle.statistics.score >= GLOBALS.game.maxVictories) {
            this.stop();
        }
    }
    getPaddleLeft() {
        return this.paddleLeft;
    }
    getPaddleRight() {
        return this.paddleRight;
    }
    getPaddleBySide(side) {
        return side == TableSide.LEFT ? this.paddleLeft : this.paddleRight;
    }
    getReversePaddleBySide(side) {
        return side == TableSide.RIGHT ? this.paddleLeft : this.paddleRight;
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
    getState() {
        return {
            id: this.id,
            left: this.paddleLeft,
            right: this.paddleRight,
            ball: this.ball,
            width: this.width,
            height: this.height,
            time: this.deltaTime.totalElapsedTimeSeconds,
            fps: this.deltaTime.FPS,
        };
    }
}
//# sourceMappingURL=game.js.map