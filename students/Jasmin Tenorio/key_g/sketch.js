let startTime = 0 // value for holding startTime of animation
let duration = 1000 // duration in milliseconds
let bgColor = [255, 200, 180]
let osc

// returns number 0-1 representing animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function setup() {
  startTime = millis() // set startTime when the sketch starts to simulate a keypress
  osc = new p5.Oscillator('square')
  osc.freq(550)
  osc.amp(0)
  osc.start()
  osc.amp(0.2, 0.05)
  osc.amp(0, 0.05, duration / 1000 - 0.05) // fade out at end (was: on next key press)
  osc.stop(duration / 1000)
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
    text('G: Drawing', 200, 30)

    stroke(255, 100, 50)
    strokeWeight(5)
    line(100, 150, 300, 280)
    line(300, 150, 100, 280)
    line(200, 120, 200, 300)
  }
}
