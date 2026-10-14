let startTime = 0;
let duration = 2000; // long enough for the ball to drop and settle

let y;
let vy = 0;
let gravity = 4;
let bounce = -0.45;
let radius = 20;
let isDropping = false;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

// Drop the ball and play sound (was: press F)
async function setup() {
  let ballSound = await loadSound("ball.mp3");
  startTime = millis(); // simulates the key press

  y = radius;
  vy = 0;
  isDropping = true;

  ballSound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    if (isDropping) {
      vy += gravity;
      y += vy;

      let ground = height - radius;

      if (y >= ground) {
        y = ground;
        vy *= bounce;

        if (abs(vy) < 1) {
          vy = 0;
          isDropping = false;
        }
      }
    }

    fill(100, 200, 255);
    noStroke();
    circle(width / 2, y, radius * 2);
  }
}
