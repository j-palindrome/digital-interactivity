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

function setup() {
  startTime = -duration;
  createCanvas(700, 500);
  colorMode(HSL);
  circleColor = color(255, 0, 0);

  explosionSound = createAudio("Explosion.mp3");
}

function draw() {
  background(30, 60, 90);

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

    explosionSound.volume(currentScale * 0.5);
  } else {
    explosionSound.volume(0);
  }
}

function keyPressed() {
  if (key.toLowerCase() === "a") {
    explosionSound.stop();
    explosionSound.play();

    startTime = millis();
    circleColor = color(random(360), random(15, 50), random(20, 40));
  }
}
