let soundO;
let startTime = 0;
let duration = 1500; // ? original fragment had no duration

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(p, { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;
    return middleLevel + (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut);
  }
  return middleLevel;
}

async function setup() {
  startTime = millis(); // set startTime when the sketch starts to simulate a keypress
  try {
    soundO = await loadSound("assets/soundO.mp3");
    soundO.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  colorMode(HSL, 360, 100, 100, 1);
  drawKeyO(progress());
}

function drawKeyO(pO) {
  if (pO > 0 && pO < 1) {
    let animSize =
      900 *
      envelope(pO, {
        fadeIn: 0.25,
        fadeOut: 0.3,
        startLevel: 0,
        middleLevel: 1,
        endLevel: 0,
      });

    push();
    translate(width / 2, height / 2);

    noFill();
    stroke(290, 95, 75, 0.9);
    strokeWeight(24);
    circle(0, 0, animSize);

    stroke(250, 85, 75, 0.6);
    strokeWeight(12);
    ellipse(0, 0, animSize * 0.6, animSize * 0.8);
    pop();
  }
}
