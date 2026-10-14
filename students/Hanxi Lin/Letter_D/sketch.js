
let startTime = 0;
let duration = 1000;
let circleColor;

let beep;
let soundReady = false;
let animationStarted = false;

async function setup() {
  createCanvas(400, 400);

  circleColor = color(random(255), random(255), random(255));

  try {
    beep = await loadSound("whoosh.mp3");
    soundReady = true;

    // Start the ball and sound together
    userStartAudio();
    startTime = millis();
    animationStarted = true;
    beep.play();
  } catch (error) {
    console.error("Could not load sound:", error);
  }
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
  let y = lerp(-40, height - 20, p);

  fill(circleColor);
  noStroke();
  circle(width / 2, y, 40);
}
