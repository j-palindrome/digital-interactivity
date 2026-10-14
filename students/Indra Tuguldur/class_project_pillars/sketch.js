let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let pillarSound

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
  pillarSound = await loadSound('pillar.wav')
  pillarSound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL)
    angleMode(DEGREES)
    let currentY = envelope(currentProgress, {
      startLevel: height + 600,
      endLevel: height / 2,
      fadeIn: 1
    })

    translate(width / 2, currentY)
    noStroke()
    fill(11, 80, 39)

    beginShape(QUADS)

    // --- LEFT SIDE ---
    vertex(-180, -550)
    vertex(-180, 150)
    vertex(-120, 150)
    vertex(-120, -550)

    vertex(-100, -550)
    vertex(-100, 150)
    vertex(-40, 150)
    vertex(-40, -550)

    // --- RIGHT SIDE ---
    vertex(40, -550)
    vertex(40, 150)
    vertex(100, 150)
    vertex(100, -550)

    vertex(120, -550)
    vertex(120, 150)
    vertex(180, 150)
    vertex(180, -550)

    endShape()
  }
}
