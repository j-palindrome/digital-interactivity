let startTime = 0;
let duration = 1000;
let circles = [];

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
  let sound = await loadSound("j.mp3");
  startTime = millis(); // simulates the key press (after load so audio and visuals line up)

  circles = [];

  for (let i = 0; i < 7; i++) {
    circles.push({
      x: random(50, 350),
      y: random(70, 240),
      size: random(15, 35)
    });
  }
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

  noStroke();
  fill(100, 106, 153, amount * 230);

  for (let c of circles) {
    circle(
      c.x,
      c.y - easeQuad(p) * 35,
      c.size * (0.7 + amount * 0.3)
    );
  }
}
