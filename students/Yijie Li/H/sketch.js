let startTime = -1000;
let duration = 1000;
let targets = [];
let whistleSound;

function setup() {
  createCanvas(700, 500);
  colorMode(HSL);
  strokeWeight(5);

  whistleSound = createAudio("mixkit-cartoon-toy-whistle-616.wav");
  whistleSound.volume(0.5);
}

function draw() {
  background(0, 0, 0);

  let p = constrain((millis() - startTime) / duration, 0, 1);

  if (p > 0 && p < 1) {
    let animVal = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    translate(width / 2, height / 2);

    for (let i = 0; i < targets.length; i++) {
      stroke(targets[i].hue, 80, 60);
      line(0, 0, targets[i].x * animVal, targets[i].y * animVal);
    }
  }
}

function keyPressed() {
  if (key.toLowerCase() === "h") {
    whistleSound.stop();
    whistleSound.play();

    startTime = millis();

    targets = [
      { x: 0, y: random(-200, 200), hue: random(0, 360) },
      { x: random(-300, 300), y: 0, hue: random(0, 360) },
      { x: random(-200, 200), y: random(-200, 200), hue: random(0, 360) },
      { x: random(-200, 200), y: random(-200, 200), hue: random(0, 360) },
    ];
  }
}
