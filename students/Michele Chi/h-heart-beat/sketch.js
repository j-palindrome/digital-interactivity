let startTime = 0;
let duration = 400; // Fast double heartbeat

// Animation progress
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

// Heartbeat animation and sound (was: press H)
async function setup() {
  let heartSound = await loadSound("heart.mp3");
  startTime = millis(); // simulates the key press

  // Play only 0.4 seconds of heartbeat sound
  heartSound.play(0, 1, 1, 0, 0.4);
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    let heartPulse = 1.0;

    // First heartbeat
    if (currentProgress < 0.45) {
      let p1 = currentProgress / 0.45;

      heartPulse = envelope(p1, {
        fadeIn: 0.2,
        fadeOut: 0.5,
        startLevel: 1.0,
        middleLevel: 1.7,
        endLevel: 1.0,
      });
    }

    // Second heartbeat
    else if (currentProgress >= 0.45 && currentProgress < 0.9) {
      let p2 = (currentProgress - 0.45) / 0.45;

      heartPulse = envelope(p2, {
        fadeIn: 0.25,
        fadeOut: 0.55,
        startLevel: 1.0,
        middleLevel: 1.4,
        endLevel: 1.0,
      });
    }

    push();
    translate(width / 2, height / 2 + 10);
    scale(heartPulse);

    rectMode(CENTER);
    fill(255, 30, 60);
    noStroke();

    // Draw red heart
    push();
    rotate(QUARTER_PI);
    square(0, 0, 60);
    circle(-30, 0, 60);
    circle(0, -30, 60);
    pop();

    pop();
  }
}
