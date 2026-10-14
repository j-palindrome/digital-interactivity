let soundS;
let startTime = 0;
let duration = 1600;

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
    soundS = await loadSound("assets/soundS.mp3");
    soundS.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pS = progress();
  if (pS > 0 && pS < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envS = envelope(pS, { fadeIn: 0.15, fadeOut: 0.25 });

    push();
    translate(0, height / 2);
    noFill();
    stroke(280, 90, 80, envS);
    strokeWeight(18);

    // Standard vertex wave
    beginShape();
    let maxDist = width * pS;
    for (let x = 0; x <= maxDist; x += 25) {
      let y = 180 * sin(x * 0.01 + frameCount * 0.07);
      vertex(x, y);
    }
    endShape();

    pop();
  }
}

