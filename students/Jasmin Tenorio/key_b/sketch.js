let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let bgColor = [200, 220, 255]

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
    text('B: Drawing', 200, 30)

    fill(100, 150, 255)
    stroke(0)
    strokeWeight(2)
    beginShape()
    vertex(200, 120)
    vertex(280, 200)
    vertex(240, 290)
    vertex(150, 270)
    vertex(120, 180)
    endShape(CLOSE)
  }
}
