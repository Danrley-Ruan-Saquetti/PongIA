export class Paddle {
  private speed: number = 6;

  public score: number = 0;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    protected tableHeight: number,
    protected side: 'left' | 'right'
  ) { }

  update() { }

  moveUp() {
    this.y -= this.speed;
    if (this.y < 0) this.y = 0;
  }

  moveDown() {
    this.y += this.speed;
    if (this.y + this.height > this.tableHeight) {
      this.y = this.tableHeight - this.height;
    }
  }

  onBallHit() { }

  onLostBall() { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
