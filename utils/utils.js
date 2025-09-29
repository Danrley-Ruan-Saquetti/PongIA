export function generateID() {
    return Math.random().toString(36).substring(2, 9);
}
export function resizeCanvas(canvas, { width = 100, height = 100 }) {
    const scale = 1;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * scale;
    canvas.height = height * scale;
}
//# sourceMappingURL=utils.js.map