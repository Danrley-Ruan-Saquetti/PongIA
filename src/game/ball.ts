import { IObservable, ListenerHandler, Observer } from '../utils/observer.js';
import { Paddle } from "./paddle.js"

type BallEvents = {
  'ball/table-out': 'left' | 'right'
  'ball/paddle-hit': 'left' | 'right'
}

export class Ball implements IObservable<BallEvents> {

  private observer: Observer<BallEvents>

  speedX = 0
  speedY = 0

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    private tableWidth: number,
    private tableHeight: number
  ) {
    this.observer = new Observer<BallEvents>()
    this.reset()
  }

  reset() {
    this.x = this.tableWidth / 2
    this.y = this.tableHeight / 2

    this.speedX = 5 * (Math.random() > 0.5 ? 1 : -1)
    this.speedY = 4 * (Math.random() > 0.5 ? 1 : -1)
  }

  update(p1: Paddle, p2: Paddle) {
    this.x += this.speedX
    this.y += this.speedY

    if (this.y - this.radius < 0 || this.y + this.radius > this.tableHeight) {
      this.speedY *= -1

      if (this.y - this.radius < 0) {
        this.y = this.radius
      } else {
        this.y = this.tableHeight - this.radius
      }
    }

    if (
      this.x - this.radius < p1.x + p1.width &&
      this.y > p1.y &&
      this.y < p1.y + p1.height
    ) {
      this.collisionPaddle(p1, 'left');
    }

    if (
      this.x + this.radius > p2.x &&
      this.y > p2.y &&
      this.y < p2.y + p2.height
    ) {
      this.collisionPaddle(p2, 'right');
    }

    if (this.x < 0) {
      this.reset();
      this.observer.emit('ball/table-out', 'left');
    }
    if (this.x > this.tableWidth) {
      this.reset();
      this.observer.emit('ball/table-out', 'right');
    }
  }

  private collisionPaddle(paddle: Paddle, side: 'left' | 'right') {
    const relativeIntersectY = this.y - (paddle.y + paddle.height / 2);

    const normalizedIntersectY = relativeIntersectY / (paddle.height / 2);

    const maxBounceAngle = Math.PI / 3;
    const bounceAngle = normalizedIntersectY * maxBounceAngle;

    const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

    this.speedY = speed * Math.sin(bounceAngle) + (Math.random() * 2 - 1);

    if (side === 'left') {
      this.speedX = speed * Math.cos(bounceAngle);

      if (this.speedX < 0) {
        this.speedX *= -1;
      }
    } else {
      this.speedX = -speed * Math.cos(bounceAngle);

      if (this.speedX > 0) {
        this.speedX *= -1;
      }
    }

    this.observer.emit('ball/paddle-hit', side);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
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
