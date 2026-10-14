let startTime = 0 // value for holding startTime of animation
let duration = 1200 // duration in milliseconds
let song

// Array holding positions and maximum sizes for the 5 yellow circles (laid out on a 400x400 area)
let circles = [
  { x: 100, y: 120, maxSize: 80 },
  { x: 300, y: 100, maxSize: 100 },
  { x: 200, y: 220, maxSize: 120 },
  { x: 90,  y: 310, maxSize: 70 },
  { x: 310, y: 300, maxSize: 90 }
]
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
  if (!song) song = await loadSound('round.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()

  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL, 360, 100, 100, 1) // HSL Color Mode
    translate(width / 2 - 200, height / 2 - 200) // center original 400x400 layout in host canvas

    // Envelope controls smooth fade-in and fade-out
    let alphaVal = envelope(currentProgress, {
      fadeIn: 0.15,
      fadeOut: 0.35,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // Eased growth factor from 0 to 1
    let scaleFactor = easeQuad(currentProgress)

    noStroke()
    fill(50, 100, 50, alphaVal) // Bright yellow in HSL

    // Render the 5 yellow circles
    for (let c of circles) {
      let currentSize = c.maxSize * scaleFactor
      circle(c.x, c.y, currentSize)
    }
  }
}
