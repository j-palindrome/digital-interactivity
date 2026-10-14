let startTime = 0 // value for holding startTime of animation
let duration = 1963 // duration in milliseconds
let mySound
// original: angle went 0 -> 3*PI by 0.08 per frame (~118 frames @ 60fps)

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
  // mySound = await loadSound('mixkit-tick-tock-clock-timer-1045.mp3')
  // mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    let tAngle = lerp(0, TWO_PI * 1.5, currentProgress)
    noFill()
    stroke(255, 240, 0)
    strokeWeight(28)
    strokeCap(SQUARE)

    // yellow circular arc, rotating
    arc(width / 2, height / 2, 260, 260, tAngle, tAngle + PI * 1.6)
  }
}
