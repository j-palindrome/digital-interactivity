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
  if (!song) song = await loadSound('spin.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL, 360, 100, 100, 1) // HSL Color Mode
    // Dark night sky background (kept: the crescent cut-out below is painted in this color)
    background(240, 50, 10)

    // 1. Opacity Envelope: Quick fade-in (0.1), stays visible, then slowly fades out over the last 40% (fadeOut: 0.4)
    let alphaVal = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.4,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // 2. Continuous rotation: Spins 2 full revolutions (TWO_PI * 2) over the 3 seconds
    let currentAngle = currentProgress * TWO_PI * 2

    push()
    translate(width / 2, height / 2) // Move origin to center of canvas
    rotate(currentAngle) // Rotate moon

    // 3. Draw crescent moon
    noStroke()

    // Outer moon shape (pale yellow circle)
    fill(55, 80, 85, alphaVal)
    circle(0, 0, 140)

    // Inner shadow cut-out matching the sky background color to form a crescent
    fill(240, 50, 10)
    circle(35, -10, 120)

    pop()
  }
}
