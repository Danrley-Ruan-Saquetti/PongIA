import { GLOBALS } from '../globals.js';
import { DeltaTime } from '../utils/delta-time.js';
import { Observer } from '../utils/observer.js';
import { generateID } from '../utils/utils.js';
import { Ball } from "./ball.js";
import { TableSide } from './types.js';
export class Game {
    get FPS() { return 1000 / (60 * this.options.speedTime); }
    constructor(width, height, paddleA, paddleB) {
        this.width = width;
        this.height = height;
        this.id = generateID();
        this.deltaTime = new DeltaTime();
        this.options = Object.assign({}, GLOBALS.game.options);
        this.countRounds = 0;
        this.isRunning = false;
        this.paddleLeft = paddleA.side == TableSide.LEFT ? paddleA : paddleB;
        this.paddleRight = paddleB.side == TableSide.RIGHT ? paddleB : paddleA;
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
        this.resetGame();
        this.ball.onStartGame();
        this.paddleLeft.onStartGame();
        this.paddleRight.onStartGame();
        this.observer.emit('game/start', null);
        this.startRound();
    }
    startRound() {
        if (this.isRunning) {
            return;
        }
        this.stopId = setTimeout(() => {
            this.stopRound();
        }, this.options.limitTime / this.options.speedTime);
        this.isRunning = true;
        this.countRounds++;
        this.ball.onStartRound();
        this.paddleLeft.onStartRound();
        this.paddleRight.onStartRound();
        this.deltaTime.setMultiplier(this.options.speedTime);
        this.deltaTime.reset();
        this.loopId = setInterval(() => this.loop(), this.FPS);
    }
    stopRound() {
        if (!this.isRunning) {
            return;
        }
        clearTimeout(this.stopId);
        clearInterval(this.loopId);
        this.isRunning = false;
        if (this.paddleLeft.statistics.score > this.paddleRight.statistics.score) {
            this.paddleLeft.onVictory();
        }
        else if (this.paddleRight.statistics.score > this.paddleLeft.statistics.score) {
            this.paddleRight.onVictory();
        }
        this.observer.emit('game/round/stop', null);
        if (this.countRounds >= this.options.rounds) {
            this.observer.emit('game/stop', null);
        }
        else {
            this.startRound();
        }
    }
    resetGame() {
        clearTimeout(this.stopId);
        clearInterval(this.loopId);
        this.isRunning = false;
        this.countRounds = 0;
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
        const totalRallies = this.paddleLeft.accStatistics.totalRallySequence + this.paddleRight.accStatistics.totalRallySequence;
        const longestRally = Math.max(this.paddleLeft.accStatistics.longestRallySequence, this.paddleRight.accStatistics.longestRallySequence);
        const totalScores = this.paddleLeft.accStatistics.score + this.paddleRight.accStatistics.score;
        const totalAnticipations = this.paddleLeft.accStatistics.anticipationTimes + this.paddleRight.accStatistics.anticipationTimes;
        const rallyDensity = totalRallies / Math.max(1, totalScores + this.paddleLeft.accStatistics.ballsLost + this.paddleRight.accStatistics.ballsLost);
        const scoreBalance = 1 - Math.abs(this.paddleLeft.accStatistics.score - this.paddleRight.accStatistics.score) / Math.max(1, totalScores);
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
    onScored(paddle, paddleLost) {
        paddle.onScore();
        paddleLost.onLostBall();
        if (paddle.statistics.score >= this.options.maxScore) {
            this.stopRound();
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