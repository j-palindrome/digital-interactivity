let startTime = 0
let duration = 1000

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

async function setup() {
  startTime = millis()
  let sound = await loadSound('anime-wow.mp3')
  sound.play()
}

function draw() {
  let currentProgress = progress()
  if (currentProgress > 0 && currentProgress < 1) {
    stroke(0)
    strokeWeight(5)
    noFill()
    let centerX = width / 2
    let centerY = height / 2
    let points = []
    for (let i = 0; i < 5; i++) {
      let angle = -HALF_PI + i * TWO_PI / 5
      points.push({ x: centerX + cos(angle) * 100, y: centerY + sin(angle) * 100 })
    }
    let order = [0, 2, 4, 1, 3, 0]
    let amount = currentProgress * 5
    for (let i = 0; i < 5; i++) {
      if (amount > i) {
        let p1 = points[order[i]]
        let p2 = points[order[i + 1]]
        let lineProgress = constrain(amount - i, 0, 1)
        let x = lerp(p1.x, p2.x, easeQuad(lineProgress))
        let y = lerp(p1.y, p2.y, easeQuad(lineProgress))
        line(p1.x, p1.y, x, y)
      }
    }
  }
}
