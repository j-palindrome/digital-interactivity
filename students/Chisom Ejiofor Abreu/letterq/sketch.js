let startTime = 0;   // value for holding startTime of animation
let duration = 600;  // 600ms duration
let mySound;
let triX = 0;
let triY = 0;
let triSize = 80;
let triAngle = 0;
let triColor;

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

  // 1. Pick random spot on canvas
  triX = random(100, width - 100);
  triY = random(100, height - 100);

  // 2. Pick random size & orientation angle
  triSize = random(40, 120);
  triAngle = random(TWO_PI);

  // 3. Pick a vibrant random RGB color!
  triColor = color(random(255), random(255), random(255));
  mySound = await loadSound('heehee.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // Envelope for fading transparency
    let triAlpha = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.4,
      startLevel: 0,
      middleLevel: 255,
      endLevel: 0
    });

    // Envelope for pop-in scaling size
    let currentScale = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.4,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    });

    triColor.setAlpha(triAlpha); // Apply dynamic transparency

    push();
    translate(triX, triY); // Move to random spot
    rotate(triAngle + currentProgress * PI); // Smooth spin as it pops up!

    fill(triColor);
    noStroke();

    // Draw balanced triangle centered at (0, 0)
    let s = triSize * currentScale;
    triangle(0, -s, -s * 0.866, s * 0.5, s * 0.866, s * 0.5);

    pop();
  }
}