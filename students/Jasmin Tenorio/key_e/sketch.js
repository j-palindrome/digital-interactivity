let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let bgColor = [210, 255, 220]

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    background(bgColor)

    // original sketch was 400x400; center it on the host canvas
    translate(width / 2 - 200, height / 2 - 200)

    fill(0)
    noStroke()
    textAlign(CENTER, CENTER)
    textSize(14)
    text('E: Drawing', 200, 30)

    noStroke()
    fill(100, 200, 150)
    circle(200, 220, 150)
  }
}
