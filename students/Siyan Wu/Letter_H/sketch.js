let startTime = 0 // value for holding startTime of animation
let duration = 583 // duration in milliseconds
let mySound
// original: half-length grew 0 -> 350 by 10 per frame (~35 frames @ 60fps)

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
  // mySound = await loadSound('mixkit-retro-game-notification-212.mp3')
  // mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    let hLength = lerp(0, 350, currentProgress)
    stroke(10)
    strokeWeight(5)

    // horizontal line
    line(width / 2 - hLength, height / 2, width / 2 + hLength, height / 2)
  }
}
