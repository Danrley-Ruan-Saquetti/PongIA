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

  protected paddles: Record<TableSide, Paddle> = { [TableSide.LEFT]: null!, [TableSide.RIGHT]: null! }

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
    this.randomSides()
    this.resetGame()

    this.ball.onStartGame()
    this.paddles[TableSide.LEFT].onStartGame()
    this.paddles[TableSide.RIGHT].onStartGame()

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
    this.paddles[TableSide.LEFT].onStartRound()
    this.paddles[TableSide.RIGHT].onStartRound()

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

    if (this.paddles[TableSide.LEFT].statistics.score > this.paddles[TableSide.RIGHT].statistics.score) {
      this.paddles[TableSide.LEFT].onVictory()
    } else if (this.paddles[TableSide.RIGHT].statistics.score > this.paddles[TableSide.LEFT].statistics.score) {
      this.paddles[TableSide.RIGHT].onVictory()
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
    this.paddles[TableSide.LEFT].reset()
    this.paddles[TableSide.RIGHT].reset()
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
    this.paddles[TableSide.LEFT].setBall(this.ball)
    this.paddles[TableSide.RIGHT].setBall(this.ball)

    this.paddles[TableSide.LEFT].setTable(this.table)
    this.paddles[TableSide.RIGHT].setTable(this.table)

    this.ball.setTable(this.table)
  }

  private loop() {
    this.update()
  }

  update() {
    this.deltaTime.next()
    this.updateInternal()

    this.paddles[TableSide.LEFT].update()
    this.paddles[TableSide.RIGHT].update()

    this.ball.update(this.paddles[TableSide.LEFT], this.paddles[TableSide.RIGHT])
  }

  protected randomSides() {
    if (Math.random() >= .5) {
      const paddleLeft = this.paddles[TableSide.LEFT]
      const paddleRight = this.paddles[TableSide.RIGHT]

      this.setPaddle(paddleLeft, TableSide.RIGHT)
      this.setPaddle(paddleRight, TableSide.LEFT)
    }
  }

  calcComplexity() {
    const paddleLeft = this.paddles[TableSide.LEFT]
    const paddleRight = this.paddles[TableSide.RIGHT]

    const totalRallies = paddleLeft.accStatistics.totalRallySequence + paddleRight.accStatistics.totalRallySequence

    const longestRally = Math.max(paddleLeft.accStatistics.longestRallySequence, paddleRight.accStatistics.longestRallySequence)

    const totalScores = paddleLeft.accStatistics.score + paddleRight.accStatistics.score
    const totalAnticipations = paddleLeft.accStatistics.anticipationTimes + paddleRight.accStatistics.anticipationTimes

    const rallyDensity = totalRallies / Math.max(1, totalScores + paddleLeft.accStatistics.ballsLost + paddleRight.accStatistics.ballsLost)

    const scoreBalance = 1 - Math.abs(paddleLeft.accStatistics.score - paddleRight.accStatistics.score) / Math.max(1, totalScores)

    let complexity = 0

    complexity += rallyDensity * .5
    complexity += (longestRally / 10) * .2
    complexity += scoreBalance * .2
    complexity += (totalAnticipations / Math.max(1, totalRallies)) * .1

    return complexity
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
    return this.paddles[TableSide.LEFT]
  }

  getPaddleRight() {
    return this.paddles[TableSide.RIGHT]
  }

  setPaddles(paddleA: Paddle, paddleB: Paddle) {
    this.setPaddle(paddleA, TableSide.LEFT)
    this.setPaddle(paddleB, TableSide.RIGHT)
  }

  protected setPaddle(paddle: Paddle, side: TableSide) {
    this.paddles[side] = paddle

    paddle.setSide(side)
  }

  getPaddleBySide(side: TableSide) {
    return this.paddles[side]
  }

  getReversePaddleBySide(side: TableSide) {
    return this.paddles[side == TableSide.LEFT ? TableSide.RIGHT : TableSide.LEFT]
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
