let startTime = 0;
let duration = 1000;
let targets = [];
let whistleSound;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

async function setup() {
  startTime = millis(); // simulate keypress
  targets = [
    { x: 0, y: random(-200, 200), hue: random(0, 360) },
    { x: random(-300, 300), y: 0, hue: random(0, 360) },
    { x: random(-200, 200), y: random(-200, 200), hue: random(0, 360) },
    { x: random(-200, 200), y: random(-200, 200), hue: random(0, 360) },
  ];
  whistleSound = await loadSound("mixkit-cartoon-toy-whistle-616.wav");
  whistleSound.setVolume(0.5);
  whistleSound.play();
}

function draw() {
  let p = progress();

  if (p > 0 && p < 1) {
    colorMode(HSL);
    strokeWeight(5);
    let animVal = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    translate(width / 2, height / 2);

    for (let i = 0; i < targets.length; i++) {
      stroke(targets[i].hue, 80, 60);
      line(0, 0, targets[i].x * animVal, targets[i].y * animVal);
    }
  }
}
