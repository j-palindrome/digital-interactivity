let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let orbSound

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
  orbSound = await loadSound('orb.wav')
  orbSound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    angleMode(DEGREES)
    noStroke()
    fill(189, 91, 56)

    translate(
      envelope(currentProgress, {
        startLevel: width / 2,
        endLevel: -1000,
        fadeIn: 1
      }),
      height / 2
    )

    push()
    rotate(lerp(0, 400, currentProgress))
    circle(350, 50, 100)
    pop()

    rotate(lerp(0, 150, currentProgress))
    circle(200, 90, 300)

    rotate(lerp(30, 350, currentProgress))
    circle(500, 60, 500)
  }
}
