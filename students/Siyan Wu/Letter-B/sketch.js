let startTime = 0 // value for holding startTime of animation
let duration = 1200 // duration in milliseconds
let mySound
// original: radius grew 40 -> 220 by 2.5 per frame (~72 frames @ 60fps)

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
  // mySound = await loadSound('mixkit-martial-arts-fast-punch-2047.mp3')
  // mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    let bRadius = lerp(40, 220, currentProgress)

    // light pink background
    background(255, 245, 245)

    fill(255)
    noStroke()

    let numTriangles = 20

    for (let i = 0; i < numTriangles; i++) {
      let angle = map(i, 0, numTriangles, 0, TWO_PI)

      let x = width / 2 + cos(angle) * bRadius
      let y = height / 2 + sin(angle) * bRadius

      push()
      translate(x, y)
      rotate(angle + HALF_PI)

      // small triangle
      triangle(0, -10, -8, 8, 8, 8)

      pop()
    }
  }
}
