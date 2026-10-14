let startTime = 0;
let duration = 1000;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(p) {
  if (p <= 0 || p >= 1) return 0;
  if (p < 0.15) return easeQuad(p / 0.15);
  if (p > 0.65) return 1 - easeQuad((p - 0.65) / 0.35);
  return 1;
}

async function setup() {
  let sound = await loadSound("h.mp3");
  startTime = millis(); // simulates the key press (after load so audio and visuals line up)

  try {
    sound.play();
  } catch (error) {
    console.error("Audio playback failed", error);
  }
}

function draw() {
  let p = progress();
  if (p <= 0 || p >= 1) return;

  // center the original 400x400 composition in the host canvas
  translate((width - 400) / 2, (height - 400) / 2);

  let amount = envelope(p);

  push();
  translate(200, 185);
  scale((0.85 + sin(p * TWO_PI * 2) * 0.1) * amount);

  noStroke();
  fill(186, 99, 126, amount * 230);

  beginShape();
  vertex(0, 45);
  bezierVertex(-90, -10, -45, -75, 0, -30);
  bezierVertex(45, -75, 90, -10, 0, 45);
  endShape(CLOSE);

  pop();
}
