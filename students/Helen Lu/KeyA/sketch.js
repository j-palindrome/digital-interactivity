let startTime = 0 // value for holding startTime of animation
let duration = 2000 // duration in milliseconds
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
  if (!song) song = await loadSound('Bright.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL, 360, 100, 100, 1)
    // Opacity envelope for smooth fade-in and fade-out
    let alphaVal = envelope(currentProgress, {
      fadeIn: 0.15,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // Eased expansion scale factor from small (0) to big (1)
    let scaleFactor = easeQuad(currentProgress)

    push()
    translate(width / 2, height / 2) // Center star on canvas

    let maxRadius = 150
    let innerRadius = (maxRadius * 0.4) * scaleFactor
    let outerRadius = maxRadius * scaleFactor

    stroke(50, 100, 60, alphaVal) // Bright yellow stroke
    strokeWeight(4)

    // Draw star outline using 10 connected line() segments
    let points = 5
    let totalPoints = points * 2

    for (let i = 0; i < totalPoints; i++) {
      let angle1 = (TWO_PI / totalPoints) * i - HALF_PI
      let angle2 = (TWO_PI / totalPoints) * (i + 1) - HALF_PI

      let r1 = (i % 2 === 0) ? outerRadius : innerRadius
      let r2 = ((i + 1) % 2 === 0) ? outerRadius : innerRadius

      let x1 = cos(angle1) * r1
      let y1 = sin(angle1) * r1
      let x2 = cos(angle2) * r2
      let y2 = sin(angle2) * r2

      // Draw line segment for star edge
      line(x1, y1, x2, y2)
    }

    pop()
  }
}
