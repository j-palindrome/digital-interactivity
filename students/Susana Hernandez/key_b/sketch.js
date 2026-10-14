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
  if (!sound) sound = await loadSound("letterB.mp3")
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

    // B
    push()
    translate(200, 200)
    scale(animScale)
    translate(-200, -200)

    noFill()
    stroke(200, 80, 100, animAlpha)
    strokeWeight(4)

    bezier(50, 100, 100, 50, 150, 150, 200, 100)
    stroke(300, 80, 100, animAlpha)
    spline(200, 200, 250, 150, 300, 250, 350, 200)

    stroke(50, 80, 100, animAlpha)
    beginShape()
    vertex(100, 250)
    splineVertex(120, 300)
    splineVertex(180, 320)
    vertex(200, 280)
    endShape()
    pop()
  }
}
