export function generateID() {
  return Math.random().toString(36).substring(2, 9)
}

export function resizeCanvas(canvas: HTMLCanvasElement, { weight = 100, height = 100 }) {
  const scale = 1

  canvas.style.width = weight + 'px'
  canvas.style.height = height + 'px'
  canvas.width = weight * scale
  canvas.height = height * scale
}
