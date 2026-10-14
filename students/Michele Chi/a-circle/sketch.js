let startTime = 0;
let duration = 3000; // 3 seconds to match audio

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

// Grow circle and play sound (was: press A)
async function setup() {
  let weeSound = await loadSound("wee.mp3");
  startTime = millis(); // simulates the key press

  weeSound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    stroke(20);
    strokeWeight(0.5);
    fill(182, 207, 219);

    let circleSize =
      100 *
      envelope(currentProgress, {
        fadeIn: 1,
        fadeOut: 0,
        startLevel: 0,
        middleLevel: 1,
        endLevel: 0,
      });

    circle(width / 2, height / 2, circleSize);
  }
}
