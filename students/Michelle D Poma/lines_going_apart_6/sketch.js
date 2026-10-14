let startTime = 0;
let duration = 3000;

// Returns number 0-1 representing animation progress
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
    return middleLevel +
      (endLevel - middleLevel) *
      easeQuad((p - (1 - fadeOut)) / fadeOut);
  }

  return middleLevel;
}

function setup() {
  startTime = millis();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // center the original 400x400 composition in the host canvas
    translate((width - 400) / 2, (height - 400) / 2);
    strokeWeight(12);

    // Use progress to move both lines
    let distance = currentProgress * 400;

    // Pink vertical line moving right
    stroke('pink');
    line(20 + distance, 100, 20 + distance, 300);

    // Black vertical line moving left
    stroke('black');
    line(380 - distance, 100, 380 - distance, 300);
  }
}
