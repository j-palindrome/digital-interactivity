
let startTime = 0;
let duration = 2000;

let waveSound;

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
  createCanvas(400, 400);
  strokeCap(ROUND);

  waveSound = new Audio("wave.mp3");
  waveSound.volume = 0.3;

  startTime = millis();

  // Start sound with the animation
  waveSound.play().catch(error => {
    console.error("Could not play wave.mp3:", error);
  });
}

function draw() {
  background(255);

  let currentProgress = progress();

  let waveAmplitudeMultiplier = envelope(currentProgress, {
    fadeIn: 0.4,
    fadeOut: 0.4,
    startLevel: 1,
    middleLevel: 1,
    endLevel: 1
  });

  let numPoints = 100;
  let waveFrequency = 2;
  let maxAmplitude = 60;
  let cy = height / 3;

  stroke(255, 105, 180);
  strokeWeight(4);
  noFill();

  beginShape();

  for (let i = 0; i < numPoints; i++) {
    let x = map(i, 0, numPoints - 1, 40, width - 40);

    let angle =
      (i / numPoints) * TWO_PI * waveFrequency -
      currentProgress * TWO_PI;

    let y = cy + sin(angle) * maxAmplitude * waveAmplitudeMultiplier;

    vertex(x, y);
  }

  endShape();

  // Restart sound and animation together
  if (currentProgress >= 1) {
    waveSound.pause();
    waveSound.currentTime = 0;

    startTime = millis();

    waveSound.play().catch(error => {
      console.error("Could not replay wave.mp3:", error);
    });
  }
}
