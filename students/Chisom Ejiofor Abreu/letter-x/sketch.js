let startTime = 0; // value for holding startTime of animation
let duration = 1000; // duration in milliseconds
let mySound;
let size = 150;
let posX = 0;
let posY = 0;

// returns number 0-1 representing animation progress
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
  // inTime fades in (start -> middle), outTime fades out (middle -> end)
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

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  posX = random(size, width - size);
  posY = random(size, height - size);
  mySound = await loadSound('buzzer1.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress();

  // Pulse background red channel (0 = black, 80 = dark red)
  let bgRed = envelope(currentProgress, {
    fadeIn: 0.1,    // Quick flash in
    fadeOut: 0.6,   // Gradual fade out
    startLevel: 0,
    middleLevel: 80, // Low number creates a rich, dark red
    endLevel: 0
  });

  if (currentProgress > 0 && currentProgress < 1) {
    background(bgRed, 0, 0); // dark red pulse is part of the visual
    strokeWeight(100)
    // 1. Scale size
    let currentSize = size * envelope(currentProgress, {
      fadeIn: 0.8,      
      fadeOut: 0.2,
      startLevel: 0.1,  
      middleLevel: 1.0, 
      endLevel: 1.0
    }); // <-- Close envelope function call here!

    // 2. Calculate opacity
    let opVal = envelope(currentProgress, {
      fadeIn: 0.2, 
      fadeOut: 0.3,
      startLevel: 0, 
      middleLevel: 255, 
      endLevel: 0
    });

    // 3. Set stroke color with alpha and draw the X
    stroke(255, 0, 0, opVal);
    line(posX - currentSize, posY - currentSize, posX + currentSize, posY + currentSize);
    line(posX - currentSize, posY + currentSize, posX + currentSize, posY - currentSize);
  }
 
  }

