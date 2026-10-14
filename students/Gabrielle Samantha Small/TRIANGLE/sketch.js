//Press the letter 'U' and you will see a triangle appear, followed by a sound.
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  let mySound = await loadSound('Netflix_New_Logo_Animation_2019.mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    // original 1080x1080 canvas with y flipped: fit it to the window, centered
    let s = min(width, height) / 1080
    translate(width / 2, height / 2)
    scale(s, -s)
    translate(-540, -540)
    stroke('black')
    strokeWeight(10)
    line(440, 390, 440, 690)
    line(440, 390, 640, 540)
    line(440, 690, 640, 540)
  }
}
