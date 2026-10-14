let startTime = 0
let duration = 1000

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

let startRadius = 10
let endRadius = 300

async function setup() {
  startTime = millis()
  let sound = await loadSound('vine-boom.mp3')
  sound.play()
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    let r = lerp(startRadius, endRadius, easeQuad(p))
    circle(width / 2, height / 2, r)
  }
}
