
let startTime = 0;
let duration = 1000; // Faster: 0.5 seconds
let rectColor;

let beep;
let soundReady = false;
let soundStarted = false;

async function setup() {
  createCanvas(400, 400);

  rectColor = color(random(255), random(255), random(255));

  try {
    beep = await loadSound("whoosh.mp3");
    soundReady = true;
  } catch (error) {
    console.error("Could not load sound:", error);
  }

  startTime = millis();
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

  let p = easeQuad(progress());
  let x = lerp(-1000, width, p);

  fill(rectColor);
  noStroke();
  rect(x, height / 2 - 25, 100, 50);

  // Start sound as the rectangle begins moving
  if (soundReady && !soundStarted && p < 1) {
    userStartAudio();
    beep.play();
    soundStarted = true;
  }

  // Stop sound when the animation finishes
  if (p >= 1 && soundStarted) {
    beep.stop();
    soundStarted = false;
  }
}

function mousePressed() {
  userStartAudio();
}
