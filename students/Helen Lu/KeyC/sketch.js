let startTime = 0 // value for holding startTime of animation
let duration = 2500 // duration in milliseconds
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
  if (!song) song = await loadSound('cloud.mp3')
  song.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    colorMode(HSL, 360, 100, 100, 1)
    // 1. Position: Flies horizontally across the canvas from left to right
    let x = lerp(-120, width + 120, easeQuad(currentProgress))
    let y = height * 0.4 // Altitude of cloud

    // 2. Opacity envelope: Smoothly fades in when entering and fades out when leaving
    let cloudAlpha = envelope(currentProgress, {
      fadeIn: 0.15,
      fadeOut: 0.15,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    })

    // Cloud styling: Pure white cloud with HSL transparency
    noStroke()
    fill(0, 0, 100, cloudAlpha) // White in HSL (0% saturation, 100% lightness)

    // 3. Draw fluffy cloud composed of multiple overlapping circles
    push()
    translate(x, y)

    // Base fluffy layer
    ellipse(0, 0, 70, 50)
    ellipse(-30, 5, 50, 40)
    ellipse(30, 5, 50, 40)

    // Top puffy section
    ellipse(-10, -20, 55, 45)
    ellipse(15, -15, 45, 35)

    pop()
  }
}
