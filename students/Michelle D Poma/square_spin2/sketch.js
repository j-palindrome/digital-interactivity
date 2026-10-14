let startTime = 0;
let duration = 6000; // Animation lasts 1000 milliseconds (1 second)


function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

async function setup() {
  let mySound = await loadSound('872775_emmonsounds_clock-ticking-new-recording-31.m4a');
  startTime = millis(); // Simulates keypress startup
  let myGain = new p5.Gain(10);

  mySound.connect(myGain);
  mySound.play();
}

function draw() {
  let currentProgress = progress();

  // Only draw while the animation progress is active (between 0 and 1)
  if (currentProgress > 0 && currentProgress < 1) {
    push();
    translate(width / 2, height / 2);

    // Spin the square based on currentProgress ( rotating a full 360 degrees)
    rotate(currentProgress * TWO_PI);

    rectMode(CENTER);
    fill('pink');
    stroke('blue');
    strokeWeight(4);

    square(0, 0, 180);
    pop(); // Restores original coordinate system
  }
}
