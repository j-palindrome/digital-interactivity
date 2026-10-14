let startTime = 0 // value for holding startTime of animation
let duration = 500 // duration in milliseconds
let osc

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn = 1, fadeOut = 0, startLevel = 0, middleLevel = 1, endLevel = 1 } = {}
) {
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }
  if (fadeOut > 0 && p > 1 - fadeOut) {
    return middleLevel + (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
  }
  return middleLevel
}

function playTone(type, freq, amp) {
  osc = new p5.Oscillator(type)
  osc.freq(freq)
  osc.amp(amp)
  osc.start()
  osc.stop(duration / 1000)
}

function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  playTone('triangle', 400, 0.3)
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    let squareSize = 200 * envelope(currentProgress, { fadeIn: 0.5, fadeOut: 0.5, startLevel: 0, middleLevel: 1, endLevel: 0 })
    noStroke()
    fill(170, 100, 88)
    square(width / 2 - squareSize / 2, height / 2 - squareSize / 2, squareSize)
  }
}
