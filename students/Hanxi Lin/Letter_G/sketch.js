
let startTime = 0;
let duration = 3000;

let totalDots = 60;
let circleRadius = 120;
let dotSize = 6;
let dots = [];

let beep;
let animationStarted = false;
let animationFinished = false;

function setup() {
  createCanvas(400, 400);

  beep = new Audio("dot.mp3");
  beep.volume = 0.3;

  for (let i = 0; i < totalDots; i++) {
    let angle = -HALF_PI + TWO_PI * i / totalDots;

    dots.push({
      x: width / 2 + cos(angle) * circleRadius,
      y: height / 2 + sin(angle) * circleRadius
    });
  }

  // Start sound and animation together
  startTime = millis();
  animationStarted = true;

  beep.play().catch(error => {
    console.error("Audio autoplay was blocked:", error);
  });
}

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function draw() {
  background(255);

  if (!animationStarted) return;

  let p = easeQuad(progress());

  let visibleDots = min(
    totalDots,
    floor(p * totalDots)
  );

  noStroke();
  fill(0);

  for (let i = 0; i < visibleDots; i++) {
    circle(dots[i].x, dots[i].y, dotSize);
  }

  // Stop sound when animation finishes
  if (p >= 1 && !animationFinished) {
    animationFinished = true;

    beep.pause();
    beep.currentTime = 0;
  }
}
