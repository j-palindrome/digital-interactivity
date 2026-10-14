let startTime = 0; // value for holding startTime of animation
let duration = 300; //  300ms = quick, intense flash!

let mySound;

let flashColor;

// returns number 0-1 representing animation progress
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

  // Pick a vibrant random RGB color for the full screen flash
  flashColor = color(random(255), random(255), random(255));
  mySound = await loadSound('pufferfish.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // Instant flash (fadeIn: 0.02) that fades down to black (fadeOut: 0.98)
    let flashAlpha = envelope(currentProgress, {
      fadeIn: 0.02,
      fadeOut: 0.98,
      startLevel: 255,
      middleLevel: 255,
      endLevel: 0,
    });

    noStroke();
    flashColor.setAlpha(flashAlpha); // Set fading transparency
    fill(flashColor);

    // Draw full-canvas flash overlay
    rect(0, 0, width, height);
  }
}