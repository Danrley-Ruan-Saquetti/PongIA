import { Vector2D } from './../utils/vector2d.js';

export class GameEntity {

  constructor(
    public readonly position = new Vector2D()
  ) { }
}
