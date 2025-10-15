export class Dimension {

  get halfWidth() { return this.width / 2 }
  get halfHeight() { return this.height / 2 }

  constructor(
    public width = 50,
    public height = 50
  ) { }
}
