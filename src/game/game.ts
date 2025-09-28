import { GLOBALS } from '../globals.js'
import { DeltaTime } from '../utils/delta-time.js'
import { IObservable, ListenerHandler, Observer } from '../utils/observer.js'
import { generateID } from '../utils/utils.js'
import { Ball } from "./ball.js"
import { Paddle } from "./paddle.js"
import { TableSide } from './types.js'

type GameEvents = {
  'game/start': null
  'game/stop': null
}

export class Game implements IObservable<GameEvents> {
  public id = generateID()

  deltaTime = new DeltaTime()
  protected observer: Observer<GameEvents>

  protected requestAnimation: number
  protected timeoutStop: number

  isRunning = false

  paddleLeft: Paddle
  paddleRight: Paddle

  protected ball: Ball

  constructor(protected width: number, protected height: number) {
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

    this.reset()

    this.timeoutStop = setTimeout(() => {
      this.stop()
    }, GLOBALS.game.limitTime)

    this.isRunning = true

    this.observer.emit('game/start', null)

    this.requestAnimation = requestAnimationFrame(() => this.loop())
  }

  stop() {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false

    clearTimeout(this.timeoutStop)
    cancelAnimationFrame(this.requestAnimation)

    this.observer.emit('game/stop', null)
  }

  reset() {
    clearTimeout(this.timeoutStop)
    cancelAnimationFrame(this.requestAnimation)

    this.isRunning = false
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

    this.ball.on('ball/paddle-hit', side => {
      this.onPaddleHitBall(this.getPaddleBySide(side))
    })
  }

  protected loadPaddles() {
    this.paddleLeft = new Paddle(10, 100, this.width, this.height, TableSide.LEFT, this.ball)
    this.paddleRight = new Paddle(10, 100, this.width, this.height, TableSide.RIGHT, this.ball)
  }

  private loop() {
    this.update()

    if (this.isRunning)
      this.requestAnimation = requestAnimationFrame(() => this.loop())
  }

  update() {
    this.deltaTime.next()
    this.updateInternal()
    this.paddleLeft.update()
    this.paddleRight.update()
    this.ball.update(this.paddleLeft, this.paddleRight)
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

  protected onPaddleHitBall(paddle: Paddle) {
    paddle.onHitBall()
  }

  protected onScored(paddle: Paddle, paddleLost: Paddle) {
    paddle.onScore()
    paddleLost.onLostBall()

    if (paddle.statistics.score >= GLOBALS.game.maxVictories) {
      this.stop()
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
      time: this.deltaTime.totalElapsedTimeSeconds,
    }
  }
}
