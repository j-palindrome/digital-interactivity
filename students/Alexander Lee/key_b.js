let startTime = 0
let duration = 600
let osc, env

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1)
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function envelope(p, { fadeIn = 0.2, fadeOut = 0.2, startLevel = 0, middleLevel = 1, endLevel = 0 } = {}) {
  if (p <= 0) return startLevel
  if (p >= 1) return endLevel
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn)
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel
    return middleLevel + (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
  }
  return middleLevel
}

function setup() {
  startTime = millis()
  if (typeof p5 !== 'undefined' && p5.Oscillator) {
    osc = new p5.Oscillator('triangle')
    osc.freq(660)
    osc.start()
    env = new p5.Envelope()
    env.setADSR(0.005, 0.5, 0.0, 0.1)
    env.setRange(0.6, 0.0)
    osc.amp(env)
    env.play()
  }
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    if (osc) {
      osc.freq(660 + sin(p * TWO_PI * 4) * 8)
    }
    let alpha = envelope(p, { fadeIn: 0.15, fadeOut: 0.4 })
    let triScale = envelope(p, { fadeIn: 0.4, fadeOut: 0.6 })
    push()
    translate(width / 2, height / 2)
    rotate(easeQuad(p) * PI * 0.5)
    noStroke()
    fill(255, alpha * 255)
    let count = 32
    let ringRadius = min(width, height) * 0.38
    let triSize = min(width, height) * 0.03 * triScale
    for (let idx = 0; idx < count; idx++) {
      let angle = (TWO_PI / count) * idx
      push()
      translate(cos(angle) * ringRadius, sin(angle) * ringRadius)
      rotate(angle + HALF_PI)
      triangle(-triSize, triSize, triSize, triSize, 0, -triSize)
      pop()
    }
    pop()
  }
}
