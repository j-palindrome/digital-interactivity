let startTime = 0;
let duration = 100;
let holdTime = 700; 
let colorLeft;
let colorRight;
let punchSound;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function setup() {
  startTime = -(duration + holdTime);
  createCanvas(700, 500);
  colorMode(HSL);

  colorLeft = color(100, 230, 20);
  colorRight = color(200, 200, 200);

  
  punchSound = createAudio("mixkit-soft-quick-punch-2151.wav");
  punchSound.volume(0.5);
}

function draw() {
  let elapsed = millis() - startTime;
  let p = progress();

  if (elapsed >= 0 && elapsed < duration + holdTime) {
    noStroke();
    fill(colorLeft);
    rect(0, 0, width / 2, height);
    fill(colorRight);
    rect(width / 2, 0, width / 2, height);

    if (p > 0 && p < 1) {
      stroke(0, 0, 0);
      strokeWeight(20);
      point(width / 2, height * p);
    }
  } else {
    background(0, 0, 100); 
  }
}

function keyPressed() {
  if (key.toLowerCase() === "y") {
    punchSound.stop();
    punchSound.play();

    startTime = millis();
    colorLeft = color(random(360), random(15, 50), random(20, 40));
    colorRight = color(random(360), random(80, 100), random(55, 75));
  }
}