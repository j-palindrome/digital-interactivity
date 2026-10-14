let startTime = 0 // value for holding startTime of animation
let duration = 550 // duration in milliseconds
let scanSound

let babyPink = [340, 70, 85]
let burgundy = [345, 70, 25]
let fromColor = burgundy // swapped on first press -> pink to burgundy
let toColor = babyPink

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(p, fadeIn, fadeOut, startLevel, middleLevel, endLevel) {
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
  scanSound = await loadSound('scan.wav')
  scanSound.play()

  // alternate wipe direction between presses
  let tmp = fromColor
  fromColor = toColor
  toColor = tmp
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    background(fromColor[0], fromColor[1], fromColor[2])

    let wipeWidth = envelope(currentProgress, 0.5, 0.5, 0, width / 2, width)

    noStroke()
    fill(toColor[0], toColor[1], toColor[2])
    rect(0, 0, wipeWidth, height)
  }
}
