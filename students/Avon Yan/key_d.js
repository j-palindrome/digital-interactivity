let startTime = 0
let duration = 500
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
    osc = new p5.Oscillator('sine')
    osc.freq(400)
    osc.start()
    env = new p5.Envelope()
    env.setADSR(0.001, 0.07, 0.0, 0.02)
    env.setRange(0.8, 0.0)
    osc.amp(env)
    env.play()
  }
}

function draw() {
  let p = progress()
  if (p > 0 && p < 1) {
    if (osc) {
      osc.freq(lerp(400, 50, easeQuad(p)))
    }
    let alpha = envelope(p, { fadeIn: 0.1, fadeOut: 0.3 })
    let scale = envelope(p, { fadeIn: 0.3, fadeOut: 0.5 })
    push()
    translate(width / 2, height / 2)
    noStroke()
    fill(50, 220, 180, alpha * 255)
    let maxR = min(width, height) * 0.35
    ellipse(0, 0, maxR * 2 * scale, maxR * 0.7 * scale)
    pop()
  }
}
