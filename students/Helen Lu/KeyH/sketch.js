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
  if (!song) song = await loadSound('swoosh.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    stroke(0)
    strokeWeight(5)
    noFill()

    // Animation level from 0 to 1
    let size = 100 * envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // Move to center
    translate(width / 2, height / 2)

    // Top triangle
    triangle(-size, -size, size, -size, 0, 0)

    // Bottom triangle
    triangle(-size, size, size, size, 0, 0)

    // Disappearing line from top to bottom
    let disappear = currentProgress * 2

    if (disappear < 1) {
      // Top part disappears first
      line(
        -size,
        -size + (size * 2 * disappear),
        size,
        -size + (size * 2 * disappear)
      )
    }
  }
}
