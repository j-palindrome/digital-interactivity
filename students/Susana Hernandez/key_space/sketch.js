let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let sound
let colorNumber = 0 // theme color, cycles on each press

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

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  // SPACEBAR = change theme color & play spacebar sound
  colorNumber = (colorNumber + 1) % 3
  if (!sound) sound = await loadSound("spacebar.wav")
  sound.stop() // Stop any overlapping playback
  sound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSB, 360, 100, 100)
    // theme color fill (was the persistent background in the original)
    if (colorNumber === 0) background(350, 30, 100)
    if (colorNumber === 1) background(350, 70, 100)
    if (colorNumber === 2) background(350, 100, 70)
  }
}
