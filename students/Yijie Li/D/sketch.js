let startTime = 0;
let duration = 1500;
let isBubbling = false;
let gameOverSound;
let bubbles = [];

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

  gameOverSound = createAudio("mixkit-arcade-retro-game-over-213.wav");
}

function draw() {
  background(0);
  let p = progress();

  if (isBubbling && p < 1) {
    let envValue = envelope(p, {
      fadeIn: 0.1,
      fadeOut: 0.4,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0,
    });
    noStroke();

    for (let i = 0; i < bubbles.length; i++) {
      let b = bubbles[i];

      let currentX = width / 2 + cos(b.angle) * (b.distance * p);
      let currentY = height / 2 + sin(b.angle) * (b.distance * p);

      fill(b.r, b.g, b.bVal, 255 * envValue);
      circle(currentX, currentY, b.size * envValue);
    }
  } else {
    isBubbling = false;
  }
}

function keyPressed() {
  if (key.toLowerCase() === "d") {
    gameOverSound.stop();
    gameOverSound.play();

    startTime = millis();
    isBubbling = true;
    bubbles = [];
    let numBubbles = 100;
    for (let i = 0; i < numBubbles; i++) {
      bubbles.push({
        angle: random(TWO_PI),
        distance: random(50, 400),
        size: random(3, 12),
        r: random(100, 255),
        g: random(150, 255),
        bVal: random(200, 255),
      });
    }
  }
}
