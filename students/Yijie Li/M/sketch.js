let startTime = 0;
let duration = 2000;
let isMoving = false;
let startX, startY, endX, endY;
let mHue = 0, mSat = 0, mLight = 0;
let radioSound;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(p, { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;
    return middleLevel + (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut);
  }
  return middleLevel;
}

function setup() {
  startTime = -duration;
  createCanvas(700, 500);
  colorMode(HSL);
  textSize(80);
  textAlign(CENTER, CENTER);

  radioSound = createAudio("mixkit-broken-radio-frequency-signal-2563.wav");
}

function draw() {
  let p = progress();

  if (isMoving && p < 1) {
    background(210, 90, 45);

    let envValue = envelope(p, {
      fadeIn: 0.1,
      fadeOut: 0.1,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    });

    let currentX = lerp(startX, endX, p);
    let currentY = lerp(startY, endY, p);

    let jitterX = currentX + random(-8, 8);
    let jitterY = currentY + random(-8, 8);

    fill((mHue + 180) % 360, mLight, mSat, envValue * 0.5); 
    text("M", jitterX + random(-7, 7), jitterY + random(-7, 7));

    fill(mHue, mSat, mLight, envValue);
    text("M", jitterX, jitterY);

    radioSound.volume(envValue * 0.5);
  } else {
    background(0, 0, 100);
    isMoving = false;
    radioSound.volume(0);
  }
}

function keyPressed() {
  if (key.toLowerCase() === "m") {
    radioSound.stop();
    radioSound.play();

    startTime = millis();
    isMoving = true;

    mHue = random(0, 360);
    mSat = random(60, 100);
    mLight = random(40, 70);

    let edge = floor(random(4));

    if (edge === 0) {
      startX = -50;
      startY = random(height);
      endX = width + 50;
      endY = random(height);
    } else if (edge === 1) {
      startX = width + 50;
      startY = random(height);
      endX = -50;
      endY = random(height);
    } else if (edge === 2) {
      startX = random(width);
      startY = -50;
      endX = random(width);
      endY = height + 50;
    } else {
      startX = random(width);
      startY = height + 50;
      endX = random(width);
      endY = -50;
    }
  }
}
