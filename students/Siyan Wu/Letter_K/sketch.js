let startTime = 0 // value for holding startTime of animation
let duration = 333 // duration in milliseconds
let mySound
// original: size grew 20 -> 120 by 5 per frame (~20 frames @ 60fps)

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
  // mySound = await loadSound('mixkit-sick-man-sneeze-2213.mp3')
  // mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    let kSize = lerp(20, 120, currentProgress)
    push()

    translate(width / 2, height / 2)

    // rotate square to make a diamond
    rotate(PI / 4)

    noStroke()
    fill(245, 255, 0)

    rectMode(CENTER)

    rect(0, 0, kSize, kSize)

    pop()
  }
}
