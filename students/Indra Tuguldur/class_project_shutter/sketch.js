let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let shutterSound

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 420, endLevel = 500 }
) {
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
  shutterSound = await loadSound('shutter.wav')
  shutterSound.play()
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    colorMode(HSL)
    let shutterHeight = envelope(p, {
      fadeIn: 0.5,
      fadeOut: 0.5,
      startLevel: 0,
      middleLevel: height,
      endLevel: height
    })

    noStroke()
    fill(15, 70, 45)
    rect(0, 0, width, shutterHeight)
  }
}
