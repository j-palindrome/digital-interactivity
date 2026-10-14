let startTime = 0
let duration = 1000

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

let points = []

async function setup() {
  startTime = millis()
  points = []
  for (let i = 0; i < 4; i++) {
    points.push({ x: random(50, 350), y: random(50, 350) })
  }
  let sound = await loadSound('ding-sound.mp3')
  sound.play()
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    translate(width / 2 - 200, height / 2 - 200) // original 400x400 layout, centered
    stroke(0)
    strokeWeight(5)
    noFill()
    beginShape()
    for (let i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y)
    }
    endShape()
  }
}
