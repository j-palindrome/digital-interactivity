let targetKey = "a";
let startTime = 0;
let duration = 1000;
let isAnimating = false;

// Returns animation progress from 0 to 1
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
  createCanvas(900, 600);
  rectMode(CENTER);
}

function draw() {
  background(245, 240, 225);

  if (!isAnimating) return;

  let currentProgress = progress();

  if (currentProgress >= 1) {
    isAnimating = false;
    return;
  }

  let level = envelope(currentProgress, {
    fadeIn: 0.2,
    fadeOut: 0.2,
    startLevel: 0,
    middleLevel: 1,
    endLevel: 0,
  });

  push();

  if (targetKey === "j") drawJ(currentProgress, level);
  if (targetKey === "o") drawO(currentProgress, level);
  if (targetKey === "p") drawP(currentProgress, level);
  if (targetKey === "m") drawM(currentProgress, level);
  if (targetKey === "z") drawZ(currentProgress, level);
  if (targetKey === "c") drawC(currentProgress, level);
  if (targetKey === "a") drawA(currentProgress, level);

  pop();
}

// J: Growing red circle
function drawJ(p, level) {
  noStroke();
  fill(220, 60, 60, 255 * level);
  circle(width / 2, height / 2, 30 + 420 * easeQuad(p));
}

// O: Expanding purple ring
function drawO(p, level) {
  noFill();
  stroke(150, 70, 210, 255 * level);
  strokeWeight(12);
  circle(width / 2, height / 2, 40 + 480 * p);
}

// P: Blue square moving left to right
function drawP(p, level) {
  noStroke();
  fill(50, 120, 220, 255 * level);

  let x = lerp(60, width - 60, easeQuad(p));
  rect(x, height / 2, 110, 110);
}

// M: Orange dots spreading outward
function drawM(p, level) {
  noStroke();
  fill(230, 120, 30, 255 * level);

  for (let i = 0; i < 12; i++) {
    let angle = (TWO_PI * i) / 12;
    let myDistance = 250 * easeQuad(p);

    let x = width / 2 + cos(angle) * myDistance;
    let y = height / 2 + sin(angle) * myDistance;

    circle(x, y, 28);
  }
}

// Z: Flashing dark zigzag
function drawZ(p, level) {
  if (floor(p * 10) % 2 === 0) {
    noFill();
    stroke(60, 60, 60, 255 * level);
    strokeWeight(12);

    beginShape();
    vertex(width / 2 - 180, height / 2 - 140);
    vertex(width / 2 + 180, height / 2 - 140);
    vertex(width / 2 - 180, height / 2 + 140);
    vertex(width / 2 + 180, height / 2 + 140);
    endShape();
  }
}

// C: Spinning yellow triangle
function drawC(p, level) {
  translate(width / 2, height / 2);
  rotate(TWO_PI * easeQuad(p));

  noStroke();
  fill(225, 170, 20, 255 * level);
  triangle(0, -110, -95, 80, 95, 80);
}

// A: Green line moving downward
function drawA(p, level) {
  stroke(40, 160, 90, 255 * level);
  strokeWeight(14);

  let y = lerp(30, height - 30, easeQuad(p));
  line(70, y, width - 70, y);
}

async function keyPressed() {
  let pressedKey = key.toLowerCase();

  if (pressedKey.length !== 1 || !"jopmzca".includes(pressedKey)) {
    return;
  }

  targetKey = pressedKey;
  startTime = millis();
  isAnimating = true;

  await userStartAudio();

  sounds[pressedKey].pause();
  sounds[pressedKey].currentTime = 0;
  await sounds[pressedKey].play();
}

let sounds = {
  j: new Audio("WRJ.mp3"),
  o: new Audio("m-e-o-w.mp3"),
  p: new Audio("ID.mp3"),
  m: new Audio("oh-my-god-meme.mp3"),
  z: new Audio("score2.wav"),
  c: new Audio("pop_7e9Is8L.mp3"),
  a: new Audio("sad-meow-song.mp3"),
};

// Generate a sound for each key
function playSound(letter) {
  let settings = {
    j: [150, 45, "sine", 0.3],
    o: [900, 300, "sine", 0.3],
    p: [350, 100, "triangle", 0.12],
    m: [650, 80, "sine", 0.15],
    z: [160, 100, "sawtooth", 0.25],
    c: [1200, 1000, "sine", 0.5],
    a: [200, 800, "triangle", 0.3],
  };

  let [first, last, type, length] = settings[letter];
  let oscillator = audioContext.createOscillator();
  let volume = audioContext.createGain();
  let now = audioContext.currentTime;

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(first, now);
  oscillator.frequency.exponentialRampToValueAtTime(last, now + length);

  volume.gain.setValueAtTime(0.001, now);
  volume.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.001, now + length);

  oscillator.connect(volume);
  volume.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + length + 0.02);

  oscillator.onended = () => {
    oscillator.disconnect();
    volume.disconnect();
  };
}
