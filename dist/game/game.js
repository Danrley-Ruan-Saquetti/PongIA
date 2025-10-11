import { GLOBALS } from '../globals.js';
import { DeltaTime } from '../utils/delta-time.js';
import { Observer } from '../utils/observer.js';
import { generateID } from '../utils/utils.js';
import { Ball } from "./ball.js";
import { TableSide } from './types.js';
export class Game {
    get isRunning() { return this._isRunning; }
    get countRounds() { return this._countRounds; }
    get FPS() { return 1000 / (60 * this.options.speedMultiplier); }
    get paddleLeft() { return this._paddleLeft; }
    get paddleRight() { return this._paddleRight; }
    constructor(table) {
        this.table = table;
        this.id = generateID();
        this.deltaTime = new DeltaTime();
        this._isRunning = false;
        this._countRounds = 0;
        this.componentsInitialized = false;
        this.options = Object.assign({}, GLOBALS.game.options);
        this.observer = new Observer();
    }
    initComponents() {
        if (this.componentsInitialized) {
            return;
        }
        this.componentsInitialized = true;
        this.loadBall();
        this.loadPaddles();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.initComponents();
        this.resetGame();
        this.ball.onStartGame();
        this._paddleLeft.onStartGame();
        this._paddleRight.onStartGame();
        this.observer.emit('game/start', null);
        this.startRound();
    }
    startRound() {
        if (this._isRunning) {
            return;
        }
        this.stopId = setTimeout(() => {
            this.stopRound();
        }, this.options.limitTime / this.options.speedMultiplier);
        this._isRunning = true;
        this._countRounds++;
        this.ball.onStartRound();
        this._paddleLeft.onStartRound();
        this._paddleRight.onStartRound();
        this.deltaTime.setMultiplier(this.options.speedMultiplier);
        this.deltaTime.reset();
        this.loopId = setInterval(() => this.loop(), this.FPS);
    }
    stopRound() {
        if (!this.isRunning) {
            return;
        }
        clearTimeout(this.stopId);
        clearInterval(this.loopId);
        this._isRunning = false;
        if (this._paddleLeft.statistics.score > this._paddleRight.statistics.score) {
            this._paddleLeft.onVictory();
        }
        else if (this._paddleRight.statistics.score > this._paddleLeft.statistics.score) {
            this._paddleRight.onVictory();
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
        this._isRunning = false;
        this._countRounds = 0;
        this.deltaTime.reset();
        this.ball.reset();
        this._paddleLeft.reset();
        this._paddleRight.reset();
    }
    loadBall() {
        this.ball = new Ball(10);
        this.ball.on('ball/table-out', side => {
            this.onScored(this.getReversePaddleBySide(side), this.getPaddleBySide(side));
        });
    }
    loadPaddles() {
        this._paddleLeft.setBall(this.ball);
        this._paddleRight.setBall(this.ball);
        this._paddleLeft.setTable(this.table);
        this._paddleRight.setTable(this.table);
        this.ball.setTable(this.table);
    }
    loop() {
        this.update();
    }
    update() {
        this.deltaTime.next();
        this.updateInternal();
        this._paddleLeft.update();
        this._paddleRight.update();
        this.ball.update(this._paddleLeft, this._paddleRight);
    }
    calcComplexity() {
        const totalRallies = this._paddleLeft.accStatistics.totalRallySequence + this._paddleRight.accStatistics.totalRallySequence;
        const longestRally = Math.max(this._paddleLeft.accStatistics.longestRallySequence, this._paddleRight.accStatistics.longestRallySequence);
        const totalScores = this._paddleLeft.accStatistics.score + this._paddleRight.accStatistics.score;
        const totalAnticipations = this._paddleLeft.accStatistics.anticipationTimes + this._paddleRight.accStatistics.anticipationTimes;
        const rallyDensity = totalRallies / Math.max(1, totalScores + this._paddleLeft.accStatistics.ballsLost + this._paddleRight.accStatistics.ballsLost);
        const scoreBalance = 1 - Math.abs(this._paddleLeft.accStatistics.score - this._paddleRight.accStatistics.score) / Math.max(1, totalScores);
        let complexity = 0;
        complexity += rallyDensity * .5;
        complexity += (longestRally / 10) * .2;
        complexity += scoreBalance * .2;
        complexity += (totalAnticipations / Math.max(1, totalRallies)) * .1;
        return Math.max(1, complexity);
    }
    moveLeftUp() {
        this._paddleLeft.moveUp();
    }
    moveLeftDown() {
        this._paddleLeft.moveDown();
    }
    moveRightUp() {
        this._paddleRight.moveUp();
    }
    moveRightDown() {
        this._paddleRight.moveDown();
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
        return this._paddleLeft;
    }
    getPaddleRight() {
        return this._paddleRight;
    }
    setPaddle(paddle) {
        if (paddle.side == TableSide.LEFT) {
            this._paddleLeft = paddle;
        }
        else {
            this._paddleRight = paddle;
        }
    }
    getPaddleBySide(side) {
        return side == TableSide.LEFT ? this._paddleLeft : this._paddleRight;
    }
    getReversePaddleBySide(side) {
        return side == TableSide.RIGHT ? this._paddleLeft : this._paddleRight;
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
            table: this.table,
            left: this._paddleLeft,
            right: this._paddleRight,
            ball: this.ball,
            round: this.countRounds,
            time: this.deltaTime.totalElapsedTimeSeconds,
            fps: this.deltaTime.FPS,
        };
    }
}
//# sourceMappingURL=game.js.map