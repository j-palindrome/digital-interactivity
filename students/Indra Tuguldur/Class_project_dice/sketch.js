let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let diceSound

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
  diceSound = await loadSound('dice.wav')
  diceSound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    angleMode(DEGREES)
    stroke(0)
    strokeWeight(11)
    fill(287, 17, 92)

    translate(
      envelope(currentProgress, {
        startLevel: width / 2,
        endLevel: -1000,
        fadeIn: 1
      }),
      height / 2
    )

    push()
    rotate(lerp(0, 720, currentProgress))
    square(0, 0, 100)
    circle(49, 50, 10)
    pop()

    rotate(lerp(0, 450, currentProgress))
    square(200, 0, 100)
    circle(235, 50, 10)
    circle(266, 50, 10)
  }
}
