let soundJ;
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
    soundJ = await loadSound("assets/soundJ.mp3");
    soundJ.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pJ = progress();
  if (pJ > 0 && pJ < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envJ = envelope(pJ, { fadeIn: 0.15, fadeOut: 0.3 });
    push();
    translate(width / 2, height / 2);

    let zoomScale = map(envJ, 0, 1, 0.2, 3.2);
    scale(zoomScale);

    fill(280, 75, 70, envJ);
    stroke(0, 0, 100, envJ);
    strokeWeight(6 / zoomScale);

    rect(-70, -50, 140, 110, 25);
    quad(-70, -35, -45, -35, -70, -90, -95, -50);
    quad(70, -35, 45, -35, 70, -90, 95, -50);

    stroke(0, 0, 100, envJ);
    strokeWeight(4 / zoomScale);
    line(-50, 20, -20, 25);
    line(50, 20, 20, 25);
    pop();
  }
}

