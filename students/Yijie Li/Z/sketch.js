let startTime = 0;
let duration = 500;
let osc;
let isSweeping = false;
let xPos = 0;
let px = 0;
let py = 250;

let spikeAmp = 150;
let spikeFreq = 2.5;
let curveAmp1 = 30;
let curveAmp2 = 15;
let curveFreq1 = 0.04;
let curveFreq2 = 0.09;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    );
  }
  return middleLevel;
}

function setup() {
  startTime = -1000;
  createCanvas(700, 500);
  background(0);
  py = height / 2;

  osc = new p5.Oscillator("sine");
  osc.amp(0);
  osc.start();
}

function draw() {
  background(0, 15);

  if (!isSweeping) return;

  let p = progress();

  let envValue = envelope(p, {
    fadeIn: 0.15,
    fadeOut: 0.35,
    startLevel: 0,
    middleLevel: 1,
    endLevel: 0,
  });

  let mainSpike = envValue * Math.sin(p * Math.PI * spikeFreq) * spikeAmp;

  let continuousCurve =
    (1 - envValue) *
    (Math.sin(xPos * curveFreq1) * curveAmp1 +
      Math.cos(xPos * curveFreq2) * curveAmp2);

  xPos += 6;
  let y = height / 2 - mainSpike - continuousCurve;

  stroke(0, 255, 0);
  strokeWeight(4);

  line(px, py, xPos, y);

  px = xPos;
  py = y;

  if (xPos >= width) {
    isSweeping = false;
  }

  if (p > 0 && p < 1) {
    osc.amp(envValue * 0.5, 0.05);
    osc.freq(600 + envValue * 200);
  } else if (isSweeping) {
    osc.amp(0.1, 0.05);
    osc.freq(300 + continuousCurve * 2);
  } else {
    osc.amp(0, 0.05);
  }
}

function keyPressed() {
  if (key.toLowerCase() === "z") {
    userStartAudio();
    startTime = millis();
    isSweeping = true;
    xPos = 0;
    px = 0;
    py = height / 2;

    spikeAmp = random(100, 220);
    spikeFreq = random(1.5, 4.0);
    curveAmp1 = random(15, 50);
    curveAmp2 = random(10, 35);
    curveFreq1 = random(0.02, 0.08);
    curveFreq2 = random(0.05, 0.15);
  }
}
