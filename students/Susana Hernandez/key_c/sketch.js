let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let sound

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
  if (!sound) sound = await loadSound("letterC.wav")
  sound.stop() // Stop any overlapping playback
  sound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSB, 360, 100, 100)
    angleMode(DEGREES)
    stroke(0)
    strokeWeight(10)
    translate(width / 2 - 200, height / 2 - 200) // center original 400x400 layout in host canvas

    let animAlpha = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 100,
      endLevel: 0,
    })

    let animScale = envelope(currentProgress, {
      fadeIn: 0.3,
      fadeOut: 0.2,
      startLevel: 0.5,
      middleLevel: 1,
      endLevel: 0.8,
    })

    // C
    push()
    translate(200, 200)
    scale(animScale)
    translate(-200, -200)

    fill(120, 50, 100, animAlpha)
    stroke(0, 0, 0, animAlpha)
    strokeWeight(3)

    triangle(300, 180, 250, 260, 350, 260)
    pop()
  }
}
