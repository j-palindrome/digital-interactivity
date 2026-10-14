let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let pacmanSound

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(p, fadeIn, fadeOut, startLevel, middleLevel, endLevel) {
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

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  pacmanSound = await loadSound('pacman.wav')
  pacmanSound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    angleMode(DEGREES)
    let currentX = envelope(currentProgress, 0.2, 0.2, 200, 400, 1200)

    noStroke()
    fill(60, 100, 50)

    let biteSize = 180 / 16
    let startAngle = biteSize * sin(frameCount * 12) + biteSize
    let endAngle = 360 - startAngle

    arc(currentX, 500, 80, 80, startAngle, endAngle, PIE)
  }
}
