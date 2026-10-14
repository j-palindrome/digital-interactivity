//Press the letter 'Z' and you will see the screen flicker from pink to gray, followed by a sound.
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  let mySound = await loadSound('Light_Switch_-_Sound_Effect_[4K].mp3')
  mySound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    // pink while "pressed" (first half), gray after "release" (second half)
    background(currentProgress < 0.5 ? 'pink' : 'gray')
  }
}
