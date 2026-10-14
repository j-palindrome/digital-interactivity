let soundA;
let startTime = 0;
let duration = 1200;

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
    soundA = await loadSound("assets/soundA.mp3");
    soundA.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pA = progress();
  if (pA > 0 && pA < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envA = envelope(pA, { fadeIn: 0.15, fadeOut: 0.3 });
    push();
    translate(width / 2 - 300, height / 2 - 200);
    rotate(pA * TWO_PI);

    let fSize = map(envA, 0, 1, 0, 220);
    fill(310, 85, 75, envA * 0.8);
    stroke(0, 0, 100, envA);
    strokeWeight(6);

    for (let i = 0; i < 4; i++) {
      push();
      rotate(i * HALF_PI + pA * QUARTER_PI);
      square(-fSize / 3, -fSize / 3, fSize * 0.6, 15);
      pop();
    }

    fill(50, 100, 85, envA);
    noStroke();
    circle(0, 0, fSize * 0.4);

    stroke(0, 0, 100, envA);
    strokeWeight(12);
    point(0, 0);
    pop();
  }
}

