let startTime = 0;
let duration = 1000;

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
    // center the original 600x600 composition in the host canvas
    translate((width - 600) / 2, (height - 600) / 2);

    // Triangle moves down (2px per frame at 60fps, now timed from the key press)
    let down = (millis() - startTime) / (1000 / 60) * 2;

    // Orange inside and black outline
    fill('orange');
    stroke('black');
    strokeWeight(5);

    triangle(
      200, 100 + down,
      100 - sin(millis() * 0.005) * 30, 280 + down,
      300 + sin(millis() * 0.005) * 30, 280 + down
    );
  }
}
