let startTime = 0;
let duration = 1000;
let circleColor;
let explosionSound;

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
  startTime = millis(); // simulate keypress
  colorMode(HSL);
  circleColor = color(random(360), random(15, 50), random(20, 40));
  colorMode(RGB); // don't leak HSL to other sketches
  explosionSound = await loadSound("Explosion.mp3");
  explosionSound.setVolume(0);
  explosionSound.play();
}

function draw() {
  let currentProgress = progress();
  if (currentProgress > 0 && currentProgress < 1) {
    let currentScale = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0,
    });

    fill(circleColor);
    noStroke();
    circle(width / 2, height / 2, 300 * currentScale);

    explosionSound.setVolume(currentScale * 0.5);
  }
}
