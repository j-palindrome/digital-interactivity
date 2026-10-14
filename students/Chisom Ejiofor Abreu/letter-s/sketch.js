let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let mySound;
let starX = 0;
let starY = 0;

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  // inTime fades in (start -> middle), outTime fades out (middle -> end)
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel
    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    )
  }
  return middleLevel
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  starX = random(100, width - 100);
  starY = random(100, height - 100);
  mySound = await loadSound('ding.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();
  let rotationAngle = currentProgress * TWO_PI * 5; 

  if (currentProgress > 0 && currentProgress < 1) {
    let starSize = envelope(currentProgress, {
      fadeIn: 0.2,
      fadeOut: 0.3,
      startLevel: 0,
      middleLevel: 100,
      endLevel: 0
    });

    let rotationAngle = currentProgress * TWO_PI * 2;

    push();
    // Translate to the random position chosen during triggerAnimation()!
    translate(starX, starY); 
    rotate(rotationAngle);
    
    fill(150, 50, 220);
    noStroke();
    drawStar(0, 0, starSize / 2, starSize, 5);
    pop();
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}