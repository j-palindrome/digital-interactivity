let startTime = 0; // value for holding startTime of animation
let duration = 1000; // duration in milliseconds
let mySound;
let circleX = 0;
let circleY = 0;
let circleColor;

// returns number 0-1 representing animation progress
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
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  circleX = random(100, width - 100);
  circleY = random(100, height - 100);
  circleColor = color(random(255), random(255), random(255));
  mySound = await loadSound('fah.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    let circleSize = currentProgress * 400; // Grows as progress increases

    // Calculate fading alpha value (255 down to 0)
    let circleAlpha = envelope(currentProgress, {
      fadeIn: 0.05,
      fadeOut: 0.95,
      startLevel: 255,
      middleLevel: 255,
      endLevel: 0
    });

    noStroke();
    circleColor.setAlpha(circleAlpha); // Apply dynamic fade
    fill(circleColor);

    circle(circleX, circleY, circleSize);
  }
}