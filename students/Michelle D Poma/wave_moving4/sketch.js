let startTime = 0;
let duration = 2000;

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
    // center the original 500x500 composition in the host canvas
    translate((width - 500) / 2, (height - 500) / 2);
    strokeWeight(4);
    noFill();

    // Move the waves (0.12 per frame at 60fps, now timed from the key press)
    let speed = (millis() - startTime) / (1000 / 60) * 0.12;

    // Pink wave moving left to right
    stroke('pink');
    beginShape();

    for (let x = 0; x <= 500; x += 10) {
      let y = 200 + sin(x * 0.02 - speed) * 30;
      vertex(x, y);
    }

    endShape();

    // Blue wave moving right to left
    stroke('blue');
    beginShape();

    for (let x = 0; x <= 500; x += 10) {
      let y = 300 + sin(x * 0.02 + speed) * 30;
      vertex(x, y);
    }

    endShape();
  }
}
