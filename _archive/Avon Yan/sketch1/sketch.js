let startTime = 0; // value for holding startTime of animation
let duration = 500; // duration in milliseconds
let osc;
let gSound;
let hSound;

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

// helper functions
function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(
  p,
  { fadeIn = 1, fadeOut = 0, startLevel = 0, middleLevel = 1, endLevel = 1 }
) {
  // inTime fades in (start -> middle), outTime fades out (middle -> end)
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }
  if (fadeOut > 0 && p > 1 - fadeOut) {
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    );
  }
  return middleLevel;
}

async function setup() {
  startTime = millis(); // set startTime when the sketch starts to simulate a keypress

  // SETUP
  createCanvas(500, 500);
  stroke(0);
  strokeWeight(20);
  colorMode(HSL);

  // sound
  osc = new p5.Oscillator();
  gSound = await loadSound("funny-sound-that-will-make-you-to-laugh_1.mp3");
    hSound = await loadSound("applepay.mp3");
}

function draw() {
  background(255);

  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    if (key === "a") {
      let circleSize =
        300 *
        envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 0,
          middleLevel: 1,
          endLevel: 0,
        });

      noStroke();
      fill(random(0, 200), random(0, 200), random(0, 200));

      circle(width / 2, height / 2, circleSize);
    }

    if (key === "s") {
      let squareSize =
        200 *
        envelope(currentProgress, {
          fadeIn: 0.5,
          fadeOut: 0.5,
          startLevel: 0,
          middleLevel: 1,
          endLevel: 0,
        });

      noStroke();
      fill(170, 100, 88);

      square(
        width / 2 - squareSize / 2,
        height / 2 - squareSize / 2,
        squareSize
      );
    }
    if (key === "d") {
      let x = width * currentProgress;

      stroke(0);
      strokeWeight(20);

      line(x, 0, x, height);
    }

    if (key === "f") {
      let x = width * currentProgress;

      noStroke();
      fill(40, 180, 40);

      circle(x, height / 2, 50);
    }

    if (key === "g") {
      let myValue = lerp(
        0,
        height,
        envelope(currentProgress, {
          fadeIn: 0.3,
          fadeOut: 0.6,
          startLevel: 0.1,
          middleLevel: 0.5,
          endLevel: 1,
        })
      );
      fill(random(250, 280), 58, 15);
      noStroke();
      circle(lerp(0, width, currentProgress), myValue, 50);
    }

    if (key === "h") {
    let x = width * currentProgress;

      noStroke();
      fill(random(180, 280), 60, 80);

     triangle(x, width, x + 50, width - 100, x + 100, width)}

     if (key === "j") {
    let x = width * currentProgress;

  let stretch = envelope(currentProgress, {
    fadeIn: 0.7,
    fadeOut: 0.7,
    startLevel: 0,
    middleLevel: 1,
    endLevel: 0,
  });

  noStroke();
  fill(random(0,50), 100, 50);

  ellipse(x, height / 2, 150 + 250 * stretch, 120 - 60 * stretch); }
  }}

function keyPressed() {
  startTime = millis();

  userStartAudio();

  if (key === "a") {
    osc.stop();
    osc = new p5.Oscillator("sine");
    osc.freq(300);
    osc.amp(0.3);
    osc.start();
  }

  if (key === "s") {
    osc.stop();
    osc = new p5.Oscillator("triangle");
    osc.freq(400);
    osc.amp(0.3);
    osc.start();
  }

  if (key === "d") {
    osc.stop();
    osc = new p5.Oscillator("sawtooth");
    osc.freq(500);
    osc.amp(0.2);
    osc.start();
  }
  if (key === "f") {
    osc.stop();
    osc = new p5.Oscillator("sine");
    osc.freq(600);
    osc.amp(0.3);
    osc.start();
  }
  if (key === "g") {
    osc.stop();
    gSound.play();
  }
   if (key === "h") {
    osc.stop();
    hSound.play();
  }
   if (key === "j") {
    osc.stop();
   osc = new p5.Oscillator("sine");
    osc.freq(800);
    osc.amp(0.2);
    osc.start();
  }
}


function keyReleased() {
  osc.stop();
  gSound.stop();
  hSound.stop();
}