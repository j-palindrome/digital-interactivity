let startTime = 0;
let duration = 1000;
let startAngle = 0;

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

// Spin the clock hand and play sound (was: press Z)
async function setup() {
  let clockSound = await loadSound("clock.mp3");
  startTime = millis(); // simulates the key press

  clockSound.play();
  // host stops calling draw() once progress hits 1, so stop the sound on a timer
  setTimeout(() => clockSound.stop(), duration);
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    let alphaValue =
      255 *
      envelope(currentProgress, {
        fadeIn: 0.1,
        fadeOut: 0.2,
        startLevel: 0,
        middleLevel: 1,
        endLevel: 0,
      });

    let angle = startAngle + currentProgress * TWO_PI;

    push();
    translate(width / 2, height / 2);
    rotate(angle);

    // Orange rotating clock hand
    stroke(255, 180, 80, alphaValue);
    strokeWeight(4);
    line(0, 0, 0, -90);

    // Center circle
    fill(255, 180, 80, alphaValue);
    noStroke();
    circle(0, 0, 10);

    pop();
  }
}
