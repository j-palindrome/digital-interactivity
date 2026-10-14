let startTime = 0 // value for holding startTime of animation
let duration = 3000 // duration in milliseconds
let song
// Animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;

  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;

    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }

  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;

    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    );
  }

  return middleLevel;
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  // load sound once, then play it with the animation
  if (!song) song = await loadSound('Pumpkin.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL, 360, 100, 100, 1) // HSL Color Mode

    let alphaVal = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.1,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    let scaleFactor = easeQuad(currentProgress)

    push()
    translate(width / 2, height / 2)
    scale(scaleFactor)

    noStroke()

    // 1. Yellow Triangle Eyes
    fill(55, 100, 50, alphaVal) // Bright Yellow

    // Left Triangle Eye
    triangle(-90, -40, -40, -40, -65, -90)

    // Right Triangle Eye
    triangle(40, -40, 90, -40, 65, -90)

    // 2. Black Mouth (Half Ellipse)
    fill(0, 0, 0, alphaVal) // Black
    arc(0, 30, 180, 120, 0, PI) // Half-ellipse arc from 0 to PI radians

    pop()
  }
}
