let startTime = 0 // value for holding startTime of animation
let duration = 5000 // duration in milliseconds

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
  let mySound = await loadSound('571502_kagateni_cute1.mp3')
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  mySound.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    // center the original 1080x1080 composition in the host canvas
    translate((width - 1080) / 2, (height - 1080) / 2)

    // Both circles move from the center to the top
    let y = lerp(540, -800, currentProgress)

    // Pink circle
    let pinkSize = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.6,
      startLevel: 0,
      middleLevel: 400,
      endLevel: 0,
    })

    ellipseMode(RADIUS)
    fill(255, 105, 180, 255 * (1 - currentProgress))
    noStroke()
    circle(540, y, pinkSize)

    // Green circle
    fill(100, 204, 0, 255 * (1 - currentProgress))
    ellipseMode(CENTER)
    ellipse(540, y, 300, 300)
  }
}
