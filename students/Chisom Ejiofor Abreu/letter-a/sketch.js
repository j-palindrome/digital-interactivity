let startTime = 0;   // value for holding startTime of animation
let duration = 400; // duration in milliseconds
let mySound;
let arrowX = 0;
let arrowY = 0;
let arrowRadius = 100;
let arrowColor;

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

  // 1. Pick random spot on canvas (with padding)
  arrowX = random(150, width - 150);
  arrowY = random(150, height - 150);

  // 2. Pick random size (radius)
  arrowRadius = random(40, 150);
  arrowColor = color(random(255), random(255), random(255));
  mySound = await loadSound('lego.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // Current sweep angle from 0 to full circle (TWO_PI)
    let currentAngle = currentProgress * TWO_PI;

    // Fade alpha using envelope
    let arrowAlpha = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.4,
      startLevel: 0,
      middleLevel: 255,
      endLevel: 0
    });

    push();
    translate(arrowX, arrowY); // Move origin to random center spot

    // --- 1. DRAW SWEEPING CIRCULAR ARC ---
    noFill();
    stroke(arrowColor);
    strokeWeight(16);
    arc(0, 0, arrowRadius * 2, arrowRadius * 2, 0, currentAngle);

    // --- 2. DRAW TANGENT ARROWHEAD AT THE TIP ---
    let tipX = cos(currentAngle) * arrowRadius;
    let tipY = sin(currentAngle) * arrowRadius;

    push();
    translate(tipX, tipY);
    // Rotate arrowhead so it aligns tangent to the circle path!
    rotate(currentAngle + HALF_PI);
    
    fill(255, arrowAlpha);
    noStroke();
    // Arrowhead triangle (pointing right along local +X axis)
    triangle(-10, -8, -10, 8, 12, 0);
    pop();

    pop();
  }
}