let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let mySound;
let startX = 0, startY = 0, endX = 0, endY = 0;

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

  let corner = floor(random(4)); // Choose corner 0, 1, 2, or 3

  if (corner === 0) { // Top-Left to Bottom-Right
  startX = 0; startY = 0;
  endX = width; endY = height;
  } else if (corner === 1) { // Top-Right to Bottom-Left
  startX = width; startY = 0;
  endX = 0; endY = height;
  } else if (corner === 2) { // Bottom-Right to Top-Left
  startX = width; startY = height;
  endX = 0; endY = 0;
  } else if (corner === 3) { // Bottom-Left to Top-Right
  startX = 0; startY = height;
  endX = width; endY = 0;
  }
  mySound = await loadSound('woosh.mp3')
  mySound.play()
}

function draw() {
let currentProgress = progress();

if (currentProgress > 0 && currentProgress < 1) {

let lineAlpha = envelope(currentProgress, {
  fadeIn: 0.1,    // Fades in during first 10% of progress
  fadeOut: 0.6,   // Fades out over last 60% of progress
  startLevel: 0,
  middleLevel: 255,
  endLevel: 0
})

strokeWeight(20)
stroke(255, lineAlpha); // Solid white stroke

// 1. Leading head tip
let headProgress = currentProgress;
let headX = lerp(startX, endX, headProgress);
let headY = lerp(startY, endY, headProgress);

// 2. Trailing tail end (lags 0.2 behind head)
let tailProgress = max(0, currentProgress - 0.2);
let tailX = lerp(startX, endX, tailProgress);
let tailY = lerp(startY, endY, tailProgress);

let offset = 50;
for (let i = 0; i < 4; i++) {
  let xOffset = i * offset;
  // Draw from the moving tail to the moving head!
  line(tailX + xOffset, tailY, headX + xOffset, headY);
}

}
}