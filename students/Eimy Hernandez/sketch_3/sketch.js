let soundC;
let startTime = 0;
let duration = 1500;

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
    soundC = await loadSound("assets/soundC.mp3");
    soundC.play();
  } catch (err) {
    console.log("Audio file loading in background or path check needed.");
  }
}

function draw() {
  let pC = progress();
  if (pC > 0 && pC < 1) {
    colorMode(HSL, 360, 100, 100, 1);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    let envC = envelope(pC, { fadeIn: 0.2, fadeOut: 0.3 });
    push();
    translate(200, height - 200);
    rotate(pC * PI);

    noFill();
    stroke(285, 85, 75, envC);
    strokeWeight(10);
    bezier(-80, 80, 150 * envC, -400, 400, -150 * envC, 500, 80);

    fill(320, 95, 80, envC);
    noStroke();
    let pSize = map(envC, 0, 1, 0, 150);
    for (let i = 0; i < 5; i++) {
      push();
      rotate((i * TWO_PI) / 5);
      ellipse(0, pSize * 0.5, pSize * 0.8, pSize * 0.4);
      pop();
    }
    fill(50, 100, 85, envC);
    circle(0, 0, pSize * 0.4);
    pop();
  }
}

