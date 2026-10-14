let soundD;
let startTime = 0;
let duration = 1800;

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
    soundD = await loadSound("assets/soundD.mp3");
    soundD.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pD = progress();
  if (pD > 0 && pD < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envD = envelope(pD, { fadeIn: 0.25, fadeOut: 0.3 });
    let sSize = map(envD, 0, 1, 0, 240);

    push();
    translate(width / 2, 250);
    rotate(pD * HALF_PI);

    fill(310, 90, 80, envD);
    stroke(0, 0, 100, envD);
    strokeWeight(6);

    triangle(0, -sSize, -sSize * 0.2, 0, sSize * 0.2, 0);
    triangle(0, sSize, -sSize * 0.2, 0, sSize * 0.2, 0);
    triangle(-sSize, 0, 0, -sSize * 0.2, 0, sSize * 0.2);
    triangle(sSize, 0, 0, -sSize * 0.2, 0, sSize * 0.2);

    stroke(55, 100, 90, envD);
    strokeWeight(22);
    point(0, 0);
    pop();
  }
}

