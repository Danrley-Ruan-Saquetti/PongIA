import { Dimension } from './../utils/dimension.js';
import { GameEntity } from './game-entity.js';
export class RectangleEntity extends GameEntity {
    constructor() {
        super(...arguments);
        this.dimension = new Dimension();
    }
    get positionInitialX() { return this.position.x - this.dimension.halfWidth; }
    get positionInitialY() { return this.position.y - this.dimension.halfHeight; }
    get positionFinalX() { return this.position.x + this.dimension.halfWidth; }
    get positionFinalY() { return this.position.y + this.dimension.halfHeight; }
}
//# sourceMappingURL=rectangle-entity.js.map