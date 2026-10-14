let startTime = 0;
let duration = 1000;

let bgRed = 30;
let bgGreen = 30;
let bgBlue = 30;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

// Pick a random background color and play sound (was: press C)
async function setup() {
  let blockSound = await loadSound("block.mp3");
  startTime = millis(); // simulates the key press

  bgRed = random(255);
  bgGreen = random(255);
  bgBlue = random(255);

  blockSound.play();
}

function draw() {
  let currentProgress = progress();

  // the color fill is the visual, so it stays (only while active)
  if (currentProgress > 0 && currentProgress < 1) {
    background(bgRed, bgGreen, bgBlue);
  }
}
