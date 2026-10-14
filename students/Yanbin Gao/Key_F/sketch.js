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
  let sound = await loadSound("f.mp3");
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

  noFill();
  stroke(75, 66, 79, envelope(p) * 230);
  strokeWeight(2);

  rect(130, 140, 140, 90, 5);

  let flapY = 185 - easeQuad(p) * 85;

  line(130, 140, 200, flapY);
  line(270, 140, 200, flapY);
  line(130, 230, 180, 185);
  line(270, 230, 220, 185);
}
