let startTime = 0
let duration = 1000

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

let upsideDown = false

async function setup() {
  startTime = millis()
  upsideDown = !upsideDown
  let sound = await loadSound('rizz-sound.mp3')
  sound.play()
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    translate(width / 2 - 200, height / 2 - 200) // original 400x400 layout, centered
    p = easeQuad(p)
    // Change from 0 to 1 depending on direction
    if (upsideDown) {
      p = 1 - p
    }
    // Move the top and bottom points
    let topY = lerp(150, 250, p)
    let bottomY = lerp(250, 150, p)
    triangle(200, topY, 150, bottomY, 250, bottomY)
  }
}
