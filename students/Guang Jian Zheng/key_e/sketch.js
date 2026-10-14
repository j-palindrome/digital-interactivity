let startTime = 0
let duration = 1000

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

let dots = []

async function setup() {
  startTime = millis()
  dots = []
  for (let i = 0; i < 20; i++) {
    dots.push({ x: random(width), y: random(height), size: random(5, 15) })
  }
  let sound = await loadSound('applepay.mp3')
  sound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    noStroke()
    let dotVisibility = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.5,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })
    for (let dot of dots) {
      fill(0, 255 * dotVisibility)
      circle(dot.x, dot.y, dot.size)
    }
  }
}
