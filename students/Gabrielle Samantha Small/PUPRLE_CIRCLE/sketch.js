//Press the letter 'W' and you will see the top half of a purple circle, followed by a sound.
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  let mySound = await loadSound('DELTARUNE_Chapter_2_WEIRD_ROUTE_Jingle_Sound_Effect.mp3')
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
    let myValue = lerp(0, 600, currentProgress)
    noStroke()
    fill('purple')
    circle(990, 10, myValue * 2)
  }
}
