
let startTime = 0;
let duration = 3000;
let bgColor;
let ding;

function setup() {
  createCanvas(400, 400);

  bgColor = color(random(255), random(255), random(255));

  ding = new Audio("ding.mp3");
  ding.volume = 0.3;

  startTime = millis();

  ding.play().catch(error => {
    console.error("Could not play ding.mp3:", error);
  });
}

function draw() {
  background(bgColor);

  // Stop sound when the 3-second sketch ends
  if (millis() - startTime >= duration) {
    ding.pause();
    ding.currentTime = 0;
    noLoop();
  }
}
