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
  if (!song) song = await loadSound('Magic.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    // 1. Reduced maximum amplitude (height) to make the sine wave smaller vertically
    let maxAmp = 80 * envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // 2. Yellow stroke with rounded caps and joins
    stroke(255, 255, 0) // Bright Yellow
    strokeWeight(12)
    strokeCap(ROUND)
    strokeJoin(ROUND)
    noFill()

    // 3. Draw the animated zigzag line progressively
    beginShape()
    let stepCount = 100 * currentProgress

    for (let i = 0; i <= stepCount; i++) {
      let t = i / 100

      // Expanded width mapping (0.15 to 0.85) to make the wave horizontally longer across the canvas
      let x = map(t, 0, 1, width * 0.15, width * 0.85)

      // Vertical oscillation
      let y = height / 2 + sin(t * TWO_PI * 2.5) * maxAmp

      vertex(x, y)
    }
    endShape()
  }
}
