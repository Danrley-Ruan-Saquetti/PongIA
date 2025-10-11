import { Vector2D } from '../utils/vector2d.js'
import { Dimension } from './../utils/dimension.js'
import { RectangleEntity } from './rectangle-entity.js'

export class Table extends RectangleEntity {

  constructor(
    dimension = new Dimension(),
    position = new Vector2D()
  ) {
    super(dimension, position)
  }
}
