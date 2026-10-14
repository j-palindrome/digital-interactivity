let startTime = 0;
let duration = 500;

let boomStart = 0.6;

let boltPoints = [];

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

function generateBolt() {
  boltPoints = [];
  let segments = 8;

  for (let i = 0; i <= segments; i++) {
    let y = (height / segments) * i;

    let xOffset = i === 0 || i === segments ? 0 : random(-60, 60);

    boltPoints.push({
      x: width / 2 + xOffset,
      y: y,
    });
  }
}

// Play BOOM immediately (was: press B)
async function setup() {
  let thunderSound = await loadSound("thunder.mp3");
  generateBolt();
  startTime = millis(); // simulates the key press

  // Skip silence and play boom immediately; the 1.5 s duration arg stops the thunder
  thunderSound.play(0, 1, 1, boomStart, 1.5);
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    let flash = envelope(currentProgress, {
      fadeIn: 0.1,
      fadeOut: 0.6,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0,
    });

    noFill();

    // Yellow lightning glow
    stroke(255, 230, 80, 180 * flash);
    strokeWeight(14 * flash);
    drawBoltPath();

    // White lightning center
    stroke(255, 255, 255, 255 * flash);
    strokeWeight(4 * flash);
    drawBoltPath();
  }
}

function drawBoltPath() {
  beginShape();

  for (let pt of boltPoints) {
    vertex(pt.x, pt.y);
  }

  endShape();
}
