let startTime = 0;
let punchDuration = 100; // the point drops over the first 100ms
let holdTime = 700; // then the split colors hold
let duration = punchDuration + holdTime; // total time the host draws this sketch
let colorLeft;
let colorRight;
let punchSound;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

async function setup() {
  startTime = millis(); // simulate keypress
  colorMode(HSL);
  colorLeft = color(random(360), random(15, 50), random(20, 40));
  colorRight = color(random(360), random(80, 100), random(55, 75));
  colorMode(RGB); // don't leak HSL to other sketches
  punchSound = await loadSound("mixkit-soft-quick-punch-2151.wav");
  punchSound.setVolume(0.5);
  punchSound.play();
}

function draw() {
  let p = progress();

  if (p > 0 && p < 1) {
    noStroke();
    fill(colorLeft);
    rect(0, 0, width / 2, height);
    fill(colorRight);
    rect(width / 2, 0, width / 2, height);

    let punchP = constrain((millis() - startTime) / punchDuration, 0, 1);
    if (punchP > 0 && punchP < 1) {
      stroke(0);
      strokeWeight(20);
      point(width / 2, height * punchP);
    }
  }
}
