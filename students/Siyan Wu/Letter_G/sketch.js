let startTime = 0 // value for holding startTime of animation
let duration = 1117 // duration in milliseconds
let mySound
// original: radius grew 20 -> 220 by 3 per frame (~67 frames @ 60fps)

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
  // mySound = await loadSound('mixkit-fast-whoosh-transition-1490.mp3')
  // mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    let gRadius = lerp(20, 220, currentProgress)

    // light pink background
    background(255, 245, 245)

    noStroke()
    fill(255) // white dots

    let numDots = 24 // how many dots
    let dotSize = 14 // size of each dot

    for (let i = 0; i < numDots; i++) {
      let angle = map(i, 0, numDots, 0, TWO_PI)

      let x = width / 2 + cos(angle) * gRadius
      let y = height / 2 + sin(angle) * gRadius

      circle(x, y, dotSize)
    }
  }
}
