
let targetKey = 'd';
let startTime = 1;
let duration = 1000;

let circleX;
let circleY;
let circleColor;

let boo;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
  createCanvas(500, 500);

  strokeWeight(10);
  noFill();

  boo = new Audio("boo.mp3");
  boo.volume = 0.3;

  newCircle();
}

function newCircle() {
  startTime = millis();

  circleX = random(100, width - 100);
  circleY = random(100, height - 100);

  circleColor = color(
    random(255),
    random(255),
    random(255)
  );

  // Start sound with the new circle
  boo.pause();
  boo.currentTime = 0;

  boo.play().catch(error => {
    console.error("Could not play boo.mp3:", error);
  });
}

function draw() {
  clear();

  let currentProgress = progress();

  let circleSize =
    200 *
    envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.8,
      startLevel: 0,
      middleLevel: 0.5,
      endLevel: 1
    });

  stroke(circleColor);
  circle(circleX, circleY, circleSize);

  if (currentProgress >= 1) {
    boo.pause();
    boo.currentTime = 0;

    newCircle();
  }
}
