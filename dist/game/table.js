import { Vector2D } from '../utils/vector2d.js';
import { Dimension } from './../utils/dimension.js';
import { GameEntity } from './game-entity.js';
export class Table extends GameEntity {
    constructor(dimension = new Dimension(), position = new Vector2D()) {
        super(position);
        this.dimension = dimension;
    }
}
//# sourceMappingURL=table.js.map