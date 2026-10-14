let startTime = 0;
let duration = 1000;
let sound;

// Returns animation progress from 0 to 1
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
  startTime = millis(); // set startTime when the sketch starts to simulate a keypress
  sound = await loadSound("pop_7e9Is8L.mp3");
  sound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    rectMode(CENTER);
    let level = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.2,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0,
    });

    drawC(currentProgress, level);
  }
}

// C: Spinning yellow triangle
function drawC(p, level) {
  translate(width / 2, height / 2);
  rotate(TWO_PI * easeQuad(p));

  noStroke();
  fill(225, 170, 20, 255 * level);
  triangle(0, -110, -95, 80, 95, 80);
}
