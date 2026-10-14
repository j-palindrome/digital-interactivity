let startTime = 0 // value for holding startTime of animation
let duration = 3000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  // inTime fades in (start -> middle), outTime fades out (middle -> end)
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    )
  }
  return middleLevel
}

function setup() {
  startTime = millis()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    rectMode(CENTER)
    noStroke()

    // Make the rectangle slowly change from big to small
    let rectSize = 500 - currentProgress * 400

    fill('pink')
    rect(width / 2, height / 2, rectSize, rectSize)
  }
}
