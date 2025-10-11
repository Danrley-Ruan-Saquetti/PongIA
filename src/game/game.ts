import { GLOBALS } from '../globals.js'
import { DeltaTime } from '../utils/delta-time.js'
import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { generateID } from '../utils/utils.js'
import { Ball } from "./ball.js"
import { Paddle } from "./paddle.js"
import { Table } from './table.js'
import { GameOptions, TableSide } from './types.js'

type GameEvents = {
  'game/start': null
  'game/stop': null
  'game/round/start': null
  'game/round/stop': null
}

export class Game implements IObservable<GameEvents> {

  readonly id = generateID()

  protected deltaTime = new DeltaTime()
  protected observer: Observer<GameEvents>

  protected ball: Ball

  protected _paddleLeft: Paddle
  protected _paddleRight: Paddle

  protected loopId: number
  protected stopId: number

  private _isRunning = false
  private _countRounds = 0
  private componentsInitialized = false

  options: GameOptions = { ...GLOBALS.game.options }

  get isRunning() { return this._isRunning }
  get countRounds() { return this._countRounds }

  get FPS_LOCKED() { return 1000 / (60 * this.options.speedMultiplier) }
  get FPS() { return this.deltaTime.FPS }
  get duration() { return this.deltaTime.totalElapsedTimeSeconds }

  constructor(
    protected table: Table
  ) {
    this.observer = new Observer<GameEvents>()
  }

  initComponents() {
    if (this.componentsInitialized) {
      return
    }

    this.componentsInitialized = true

    this.loadBall()
    this.loadPaddles()
  }

  start() {
    if (this.isRunning) {
      return
    }

    this.initComponents()
    this.resetGame()

    this.ball.onStartGame()
    this._paddleLeft.onStartGame()
    this._paddleRight.onStartGame()

    this.observer.emit('game/start', null)

    this.startRound()
  }

  protected startRound() {
    if (this._isRunning) {
      return
    }

    this.stopId = setTimeout(() => {
      this.stopRound()
    }, this.options.limitTime / this.options.speedMultiplier)

    this._isRunning = true
    this._countRounds++

    this.ball.onStartRound()
    this._paddleLeft.onStartRound()
    this._paddleRight.onStartRound()

    this.deltaTime.setMultiplier(this.options.speedMultiplier)
    this.deltaTime.reset()

    this.loopId = setInterval(() => this.loop(), this.FPS_LOCKED)
  }

  protected stopRound() {
    if (!this.isRunning) {
      return
    }

    clearTimeout(this.stopId)
    clearInterval(this.loopId)

    this._isRunning = false

    if (this._paddleLeft.statistics.score > this._paddleRight.statistics.score) {
      this._paddleLeft.onVictory()
    } else if (this._paddleRight.statistics.score > this._paddleLeft.statistics.score) {
      this._paddleRight.onVictory()
    }

    this.observer.emit('game/round/stop', null)

    if (this.countRounds >= this.options.rounds) {
      this.observer.emit('game/stop', null)
    }
    else {
      this.startRound()
    }
  }

  resetGame() {
    clearTimeout(this.stopId)
    clearInterval(this.loopId)

    this._isRunning = false
    this._countRounds = 0

    this.deltaTime.reset()

    this.ball.reset()
    this._paddleLeft.reset()
    this._paddleRight.reset()
  }

  protected loadBall() {
    this.ball = new Ball(10)

    this.ball.on('ball/table-out', side => {
      this.onScored(
        this.getReversePaddleBySide(side),
        this.getPaddleBySide(side)
      )
    })
  }

  protected loadPaddles() {
    this._paddleLeft.setBall(this.ball)
    this._paddleRight.setBall(this.ball)

    this._paddleLeft.setTable(this.table)
    this._paddleRight.setTable(this.table)

    this.ball.setTable(this.table)
  }

  private loop() {
    this.update()
  }

  update() {
    this.deltaTime.next()
    this.updateInternal()
    this._paddleLeft.update()
    this._paddleRight.update()
    this.ball.update(this._paddleLeft, this._paddleRight)
  }

  calcComplexity() {
    const totalRallies = this._paddleLeft.accStatistics.totalRallySequence + this._paddleRight.accStatistics.totalRallySequence

    const longestRally = Math.max(this._paddleLeft.accStatistics.longestRallySequence, this._paddleRight.accStatistics.longestRallySequence)

    const totalScores = this._paddleLeft.accStatistics.score + this._paddleRight.accStatistics.score
    const totalAnticipations = this._paddleLeft.accStatistics.anticipationTimes + this._paddleRight.accStatistics.anticipationTimes

    const rallyDensity = totalRallies / Math.max(1, totalScores + this._paddleLeft.accStatistics.ballsLost + this._paddleRight.accStatistics.ballsLost)

    const scoreBalance = 1 - Math.abs(this._paddleLeft.accStatistics.score - this._paddleRight.accStatistics.score) / Math.max(1, totalScores)

    let complexity = 0

    complexity += rallyDensity * .5
    complexity += (longestRally / 10) * .2
    complexity += scoreBalance * .2
    complexity += (totalAnticipations / Math.max(1, totalRallies)) * .1

    return Math.max(1, complexity)
  }

  moveLeftUp() {
    this._paddleLeft.moveUp()
  }

  moveLeftDown() {
    this._paddleLeft.moveDown()
  }

  moveRightUp() {
    this._paddleRight.moveUp()
  }

  moveRightDown() {
    this._paddleRight.moveDown()
  }

  protected updateInternal() { }

  protected onScored(paddle: Paddle, paddleLost: Paddle) {
    paddle.onScore()
    paddleLost.onLostBall()

    if (paddle.statistics.score >= this.options.maxScore) {
      this.stopRound()
    }
  }

  getTable() {
    return this.table
  }

  getBall() {
    return this.ball
  }

  getPaddleLeft() {
    return this._paddleLeft
  }

  getPaddleRight() {
    return this._paddleRight
  }

  setPaddle(paddle: Paddle) {
    if (paddle.side == TableSide.LEFT) {
      this._paddleLeft = paddle
    } else {
      this._paddleRight = paddle
    }
  }

  getPaddleBySide(side: TableSide) {
    return side == TableSide.LEFT ? this._paddleLeft : this._paddleRight
  }

  getReversePaddleBySide(side: TableSide) {
    return side == TableSide.RIGHT ? this._paddleLeft : this._paddleRight
  }

  on<EventName extends keyof GameEvents>(event: EventName, handler: ListenerHandler<GameEvents[EventName]>) {
    return this.observer.on(event, handler)
  }

  clearListener(event: keyof GameEvents, id: string) {
    this.observer.clearListener(event, id)
  }

  clearAllListeners() {
    this.observer.clearAllListeners()
  }

  clearListenersByEvent(event: keyof GameEvents) {
    this.observer.clearListenersByEvent(event)
  }
}
