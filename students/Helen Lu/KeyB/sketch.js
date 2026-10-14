let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
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
  if (!song) song = await loadSound('bubble.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    // Envelope controls opacity (fades in and out smoothly)
    let alphaVal = map(
      envelope(currentProgress, {
        fadeIn: 0.15,
        fadeOut: 0.25,
        startLevel: 0,
        middleLevel: 1,
        endLevel: 0
      }),
      0, 1, 0, 255
    )

    // Eased expansion from small to large
    let size = lerp(20, 200, easeQuad(currentProgress))
    let x = width / 2
    let y = height / 2

    // 1. Semi-transparent bubble body fill
    fill(255, 255, 255, alphaVal * 0.12)

    // 2. Clear outer rim highlight
    stroke(255, 255, 255, alphaVal * 0.8)
    strokeWeight(2.5)
    circle(x, y, size)

    // 3. Curved specular highlight reflection (gives the "glass/soap" bubble effect)
    noFill()
    stroke(255, 255, 255, alphaVal * 0.95)
    strokeWeight(3.5)
    arc(
      x - size * 0.05,
      y - size * 0.05,
      size * 0.75,
      size * 0.75,
      PI + QUARTER_PI,
      HALF_PI + PI
    )
  }
}
