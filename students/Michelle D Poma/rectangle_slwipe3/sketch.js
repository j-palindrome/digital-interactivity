let startTime = 0
let duration = 2000

// Returns animation progress from 0 to 1
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel

  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel +
      (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }

  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel
    return middleLevel +
      (endLevel - middleLevel) *
      easeQuad((p - (1 - fadeOut)) / fadeOut)
  }

  return middleLevel
}

function setup() {
  startTime = millis()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    // center the original 500x500 composition in the host canvas
    translate((width - 500) / 2, (height - 500) / 2)

    let rectangleHeight = 500 / 4

    // Rectangles grow from left to right
    let value = easeQuad(currentProgress)

    fill('pink')
    stroke('blue')
    strokeWeight(2)

    for (let i = 0; i < 4; i++) {
      let y = i * rectangleHeight
      rect(0, y, value * 500, rectangleHeight)
    }
  }
}
