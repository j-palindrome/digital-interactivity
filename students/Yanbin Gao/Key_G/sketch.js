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
  let sound = await loadSound("g.mp3");
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

  noFill();
  stroke(75, 66, 79, amount * 230);
  strokeWeight(2);

  beginShape();

  for (let x = 60; x <= 340; x += 4) {
    let y =
      220 - sin((x - 60) / 280 * PI) * 90 * amount;

    vertex(x, y);
  }

  endShape();
}
