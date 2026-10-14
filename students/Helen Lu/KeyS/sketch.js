let startTime = 0 // value for holding startTime of animation
let duration = 2000 // duration in milliseconds
let song
let maxSize = 100
// (original used 0-2 progress with a 1000ms duration: expand then shrink)
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
  if (!song) song = await loadSound('Wand.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    stroke(0)
    strokeWeight(2)
    noFill()

    // Expand (first half) and then shrink (second half)
    let currentSize
    if (currentProgress <= 0.5) {
      currentSize = maxSize * easeQuad(currentProgress * 2)
    } else {
      currentSize = maxSize * (1 - easeQuad(currentProgress * 2 - 1))
    }

    // Put the drawing origin at the center
    translate(width / 2, height / 2)

    // Draw expanding and shrinking square
    rect(-currentSize / 2, -currentSize / 2, currentSize, currentSize)

    // Draw expanding and shrinking diamond
    push()
    rotate(QUARTER_PI)
    rect(-currentSize / 2, -currentSize / 2, currentSize, currentSize)
    pop()
  }
}
