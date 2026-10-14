//When you press the letter 'f', you will get four blue lines accompanied with a sound.
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  let mySound = await loadSound('Super-Mario-World-Game-Over.mp3')
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
    let myValue = lerp(0, 700, currentProgress)
    fill('blue')
    noStroke()
    rect(100, 200, myValue, 50)
    rect(100, 350, myValue, 50)
    rect(100, 500, myValue, 50)
    rect(100, 650, myValue, 50)
  }
}
