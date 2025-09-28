import { IObservable, ListenerHandler, Observer } from '../utils/observer.js';
import { Vector2D } from './../utils/vector2d.js';
import { Paddle } from "./paddle.js";
import { TableSide } from './types.js';

type BallEvents = {
  'ball/table-out': TableSide
  'ball/paddle-hit': TableSide
}

export class Ball implements IObservable<BallEvents> {

  private observer: Observer<BallEvents>

  speed: Vector2D
  alphaSpeed = 1
  position: Vector2D

  constructor(
    public radius: number,
    private tableWidth: number,
    private tableHeight: number
  ) {
    this.observer = new Observer<BallEvents>()
    this.speed = new Vector2D()
    this.position = new Vector2D()
    this.reset()
  }

  reset() {
    this.position.x = this.tableWidth / 2
    this.position.y = this.tableHeight / 2

    this.speed.x = 5 * (Math.random() > 0.5 ? 1 : -1)
    this.speed.y = 4 * (Math.random() > 0.5 ? 1 : -1)

    this.alphaSpeed = 1
  }

  update(p1: Paddle, p2: Paddle) {
    this.position.x += this.speed.x * this.alphaSpeed
    this.position.y += this.speed.y * this.alphaSpeed

    if (this.position.y - this.radius < 0 || this.position.y + this.radius > this.tableHeight) {
      this.speed.y *= -1

      if (this.position.y - this.radius < 0) {
        this.position.y = this.radius
      } else {
        this.position.y = this.tableHeight - this.radius
      }
    }

    if (
      this.position.x - this.radius < p1.position.x + p1.width &&
      this.position.y > p1.position.y &&
      this.position.y < p1.position.y + p1.height
    ) {
      this.collisionPaddle(p1, TableSide.LEFT);
    }

    if (
      this.position.x + this.radius > p2.position.x &&
      this.position.y > p2.position.y &&
      this.position.y < p2.position.y + p2.height
    ) {
      this.collisionPaddle(p2, TableSide.RIGHT);
    }

    if (this.position.x < 0) {
      this.reset();
      this.observer.emit('ball/table-out', TableSide.LEFT);
    }
    if (this.position.x > this.tableWidth) {
      this.reset();
      this.observer.emit('ball/table-out', TableSide.RIGHT);
    }
  }

  private collisionPaddle(paddle: Paddle, side: TableSide) {
    const relativeIntersectY = this.position.y - (paddle.position.y + paddle.height / 2);

    const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);

    const maxBounceAngle = Math.PI / 3;
    const bounceAngle = normalizedIntersectY * maxBounceAngle;

    const speed = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);

    this.speed.y = speed * Math.sin(bounceAngle);

    if (side == TableSide.LEFT) {
      this.speed.x = speed * Math.cos(bounceAngle);

      if (this.speed.x < 0) {
        this.speed.x *= -1;
      }
    } else {
      this.speed.x = -speed * Math.cos(bounceAngle);

      if (this.speed.x > 0) {
        this.speed.x *= -1;
      }
    }

    if (this.alphaSpeed < 2) {
      this.alphaSpeed += .05
    }

    this.observer.emit('ball/paddle-hit', side);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }

  on<EventName extends keyof BallEvents>(event: EventName, handler: ListenerHandler<BallEvents[EventName]>) {
    return this.observer.on(event, handler)
  }

  clearListener(event: keyof BallEvents, id: string) {
    this.observer.clearListener(event, id)
  }

  clearAllListeners() {
    this.observer.clearAllListeners()
  }

  clearListenersByEvent(event: keyof BallEvents) {
    this.observer.clearListenersByEvent(event)
  }
}
