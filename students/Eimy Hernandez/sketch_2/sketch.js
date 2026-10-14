let soundE;
let startTime = 0;
let duration = 1400;

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
    soundE = await loadSound("assets/soundE.mp3");
    soundE.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pE = progress();
  if (pE > 0 && pE < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envE = envelope(pE, { fadeIn: 0.1, fadeOut: 0.15 });
    push();
    let posX = lerp(150, width - 150, pE);
    let posY = height / 3;
    translate(posX, posY);

    let mouthAngle = 0.15 + 0.15 * sin(frameCount * 0.3);

    fill(55, 90, 75, envE);
    stroke(0, 0, 100, envE);
    strokeWeight(6);
    let pacSize = 130;
    arc(0, 0, pacSize, pacSize, mouthAngle, TWO_PI - mouthAngle, PIE);

    if (pE < 0.85) {
      fill(310, 90, 80, envE);
      noStroke();
      circle(140 - pE * 120, 0, 25);
    }

    pop();
  }
}

