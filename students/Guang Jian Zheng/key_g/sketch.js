let startTime = 0
let duration = 2500

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
  startTime = millis()
  let sound = await loadSound('buzzer.mp3')
  sound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    translate(width / 2 - 200, height / 2 - 200) // original 400x400 layout, centered
    let xVisibility = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.5,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })
    strokeWeight(25)
    stroke(255, 0, 0, 255 * xVisibility)
    line(100, 100, 300, 300)
    line(300, 100, 100, 300)
  }
}
