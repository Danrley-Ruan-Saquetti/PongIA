import { GLOBALS } from '../globals.js'
import { DeltaTime } from '../utils/delta-time.js'
import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { generateID } from '../utils/utils.js'
import { Ball } from "./ball.js"
import { Paddle } from "./paddle.js"
import { GameOptions, TableSide } from './types.js'

type GameEvents = {
  'game/start': null
  'game/stop': null
  'game/round/start': null
  'game/round/stop': null
}

export class Game implements IObservable<GameEvents> {
  public id = generateID()

  deltaTime = new DeltaTime()
  protected observer: Observer<GameEvents>

  protected ball: Ball

  public paddleLeft: Paddle
  public paddleRight: Paddle

  protected loopId: number
  protected stopId: number

  options: GameOptions = { ...GLOBALS.game.options }

  countRounds = 0
  isRunning = false

  get FPS() { return 1000 / (60 * this.options.speedMultiplier) }

  constructor(
    protected width: number,
    protected height: number,
    paddleA: Paddle,
    paddleB: Paddle
  ) {
    this.paddleLeft = paddleA.side == TableSide.LEFT ? paddleA : paddleB
    this.paddleRight = paddleB.side == TableSide.RIGHT ? paddleB : paddleA

    this.observer = new Observer<GameEvents>()

    this.initComponents()
  }

  initComponents() {
    this.loadBall()
    this.loadPaddles()
  }

  start() {
    if (this.isRunning) {
      return
    }

    this.resetGame()

    this.ball.onStartGame()
    this.paddleLeft.onStartGame()
    this.paddleRight.onStartGame()

    this.observer.emit('game/start', null)

    this.startRound()
  }

  protected startRound() {
    if (this.isRunning) {
      return
    }

    this.stopId = setTimeout(() => {
      this.stopRound()
    }, this.options.limitTime / this.options.speedMultiplier)

    this.isRunning = true
    this.countRounds++

    this.ball.onStartRound()
    this.paddleLeft.onStartRound()
    this.paddleRight.onStartRound()

    this.deltaTime.setMultiplier(this.options.speedMultiplier)
    this.deltaTime.reset()

    this.loopId = setInterval(() => this.loop(), this.FPS)
  }

  protected stopRound() {
    if (!this.isRunning) {
      return
    }

    clearTimeout(this.stopId)
    clearInterval(this.loopId)

    this.isRunning = false

    if (this.paddleLeft.statistics.score > this.paddleRight.statistics.score) {
      this.paddleLeft.onVictory()
    } else if (this.paddleRight.statistics.score > this.paddleLeft.statistics.score) {
      this.paddleRight.onVictory()
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

    this.isRunning = false
    this.countRounds = 0

    this.deltaTime.reset()

    this.ball.reset()
    this.paddleLeft.reset()
    this.paddleRight.reset()
  }

  protected loadBall() {
    this.ball = new Ball(10, this.width, this.height)

    this.ball.on('ball/table-out', side => {
      this.onScored(
        this.getReversePaddleBySide(side),
        this.getPaddleBySide(side)
      )
    })
  }

  protected loadPaddles() {
    this.paddleLeft.ball = this.ball
    this.paddleRight.ball = this.ball
  }

  private loop() {
    this.update()
  }

  update() {
    this.deltaTime.next()
    this.updateInternal()
    this.paddleLeft.update()
    this.paddleRight.update()
    this.ball.update(this.paddleLeft, this.paddleRight)
  }

  calcComplexity() {
    const totalRallies = this.paddleLeft.accStatistics.totalRallySequence + this.paddleRight.accStatistics.totalRallySequence

    const longestRally = Math.max(this.paddleLeft.accStatistics.longestRallySequence, this.paddleRight.accStatistics.longestRallySequence)

    const totalScores = this.paddleLeft.accStatistics.score + this.paddleRight.accStatistics.score
    const totalAnticipations = this.paddleLeft.accStatistics.anticipationTimes + this.paddleRight.accStatistics.anticipationTimes

    const rallyDensity = totalRallies / Math.max(1, totalScores + this.paddleLeft.accStatistics.ballsLost + this.paddleRight.accStatistics.ballsLost)

    const scoreBalance = 1 - Math.abs(this.paddleLeft.accStatistics.score - this.paddleRight.accStatistics.score) / Math.max(1, totalScores)

    let complexity = 0

    complexity += rallyDensity * .5
    complexity += (longestRally / 10) * .2
    complexity += scoreBalance * .2
    complexity += (totalAnticipations / Math.max(1, totalRallies)) * .1

    return Math.max(1, complexity)
  }

  moveLeftUp() {
    this.paddleLeft.moveUp()
  }

  moveLeftDown() {
    this.paddleLeft.moveDown()
  }

  moveRightUp() {
    this.paddleRight.moveUp()
  }

  moveRightDown() {
    this.paddleRight.moveDown()
  }

  protected updateInternal() { }

  protected onScored(paddle: Paddle, paddleLost: Paddle) {
    paddle.onScore()
    paddleLost.onLostBall()

    if (paddle.statistics.score >= this.options.maxScore) {
      this.stopRound()
    }
  }

  getPaddleLeft() {
    return this.paddleLeft
  }

  getPaddleRight() {
    return this.paddleRight
  }

  getPaddleBySide(side: TableSide) {
    return side == TableSide.LEFT ? this.paddleLeft : this.paddleRight
  }

  getReversePaddleBySide(side: TableSide) {
    return side == TableSide.RIGHT ? this.paddleLeft : this.paddleRight
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

  getState() {
    return {
      id: this.id,
      left: this.paddleLeft,
      right: this.paddleRight,
      ball: this.ball,
      width: this.width,
      height: this.height,
      round: this.countRounds,
      time: this.deltaTime.totalElapsedTimeSeconds,
      fps: this.deltaTime.FPS,
    }
  }
}
