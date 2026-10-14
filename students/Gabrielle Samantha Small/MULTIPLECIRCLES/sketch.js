//Press the letter 'o' and you will see multiple circles, followed by a sound.
let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

async function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  let mySound = await loadSound('Saiki_K_Main_Music.mp3')
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
    //circle 2
    fill('yellow')
    circle(650, 500, myValue)
    //Circle 3
    fill('purple')
    circle(250, 750, myValue)
    //Circle 4
    fill('red')
    circle(90, 950, myValue)
    //Cirlce 5
    fill('pink')
    circle(790, 890, myValue)
    //Circle 6
    fill('lime')
    circle(880, 100, myValue)
  }
}
