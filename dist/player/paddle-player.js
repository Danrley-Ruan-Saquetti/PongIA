import { Paddle } from '../game/paddle.js';
export class PaddlePlayer extends Paddle {
    constructor(keyUp, keyDown) {
        super();
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.keysPressed = new Set();
        this.onKeyDown = (e) => this.keysPressed.add(e.key);
        this.onkeyUp = (e) => this.keysPressed.delete(e.key);
        this.color = '#2e5fffff';
    }
    reset() {
        super.reset();
        this.keysPressed.clear();
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onkeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onkeyUp);
    }
    update() {
        super.update();
        if (this.keysPressed.has(this.keyUp))
            this.moveUp();
        if (this.keysPressed.has(this.keyDown))
            this.moveDown();
    }
}
//# sourceMappingURL=paddle-player.js.map