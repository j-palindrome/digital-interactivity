let startTime = 0
let duration = 800

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function setup() {
  startTime = millis()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    stroke(0)
    strokeWeight(3)
    noFill()
    let centerX = width / 2
    let centerY = height / 2
    let drawProgress
    let fadeProgress
    if (currentProgress < 0.7) {
      drawProgress = currentProgress / 0.7
      fadeProgress = 0
    } else {
      drawProgress = 1
      fadeProgress = (currentProgress - 0.7) / 0.3
    }
    let maxAngle = TWO_PI * 4
    let startAngle = maxAngle * fadeProgress
    beginShape()
    for (let angle = startAngle; angle <= maxAngle * drawProgress; angle += 0.05) {
      let radius = 5 + (120 * angle / maxAngle)
      vertex(centerX + cos(angle) * radius, centerY + sin(angle) * radius)
    }
    endShape()
  }
}
