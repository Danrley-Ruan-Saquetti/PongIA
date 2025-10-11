import { Dimension } from './../utils/dimension.js';
import { GameEntity } from './game-entity.js';

export class RectangleEntity extends GameEntity {

  dimension = new Dimension()

  get positionInitialX() { return this.position.x - this.halfWidth }
  get positionInitialY() { return this.position.y - this.halfHeight }

  get positionFinalX() { return this.position.x + this.halfWidth }
  get positionFinalY() { return this.position.y + this.halfHeight }

  get halfWidth() { return this.dimension.width / 2 }
  get halfHeight() { return this.dimension.height / 2 }
}
