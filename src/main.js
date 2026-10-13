/**
 * src/main.js — Vite vanilla JS entry point
 * Loads student sketches as raw source text, compiles each into an isolated
 * setup()/draw() execution context, and binds randomized folders to A-Z keys.
 */

// 1. Import all student sketch files as raw text strings
const sketchModules = import.meta.glob('/students/**/*.js', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Fisher-Yates array shuffle
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Creates an executable instance from raw student sketch code string.
 * Student sketches define top-level variables (startTime, duration, osc, etc.)
 * and global-like functions setup(), draw(), progress(), easeQuad(), envelope().
 * Evaluating them inside a closure isolates variables across sketches and keys.
 */
function compileSketch(codeString, p, meta) {
  const wrapped = `
    return (function(p, meta) {
      // p5 instance proxies inside the sketch scope
      const width = p.width
      const height = p.height
      const PI = p.PI
      const TWO_PI = p.TWO_PI
      const HALF_PI = p.HALF_PI

      function millis() { return p.millis() }
      function constrain(n, low, high) { return p.constrain(n, low, high) }
      function map(n, s1, s2, d1, d2) { return p.map(n, s1, s2, d1, d2) }
      function lerp(s, e, a) { return p.lerp(s, e, a) }
      function sin(a) { return p.sin(a) }
      function cos(a) { return p.cos(a) }
      function min(a, b) { return p.min(a, b) }
      function max(a, b) { return p.max(a, b) }
      function stroke(...args) { return p.stroke(...args) }
      function noStroke() { return p.noStroke() }
      function strokeWeight(...args) { return p.strokeWeight(...args) }
      function fill(...args) { return p.fill(...args) }
      function noFill() { return p.noFill() }
      function point(...args) { return p.point(...args) }
      function ellipse(...args) { return p.ellipse(...args) }
      function arc(...args) { return p.arc(...args) }
      function rect(...args) { return p.rect(...args) }
      function line(...args) { return p.line(...args) }
      function triangle(...args) { return p.triangle(...args) }
      function push() { return p.push() }
      function pop() { return p.pop() }
      function translate(...args) { return p.translate(...args) }
      function rotate(...args) { return p.rotate(...args) }
      function scale(...args) { return p.scale(...args) }
      function createCanvas() {} // no-op since canvas is shared
      function background() {} // host handles background

      ${codeString}

      return {
        setup: typeof setup === 'function' ? setup : null,
        draw: typeof draw === 'function' ? draw : null,
        progress: typeof progress === 'function' ? progress : null,
        getStartTime: () => (typeof startTime !== 'undefined' ? startTime : 0),
        setStartTime: (t) => { if (typeof startTime !== 'undefined') startTime = t },
      }
    })(p, meta);
  `

  try {
    const fn = new Function('p', 'meta', wrapped)
    return fn(p, meta)
  } catch (err) {
    console.error(`Error compiling sketch [${meta.filePath}]:`, err)
    return null
  }
}

// Map of alphabet key -> active sketch instance info
const keyBindings = {}

// Single shared p5 instance
new window.p5((p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(17)

    // Group available sketch files by student folder
    const filesByFolder = {}
    for (const [filePath, code] of Object.entries(sketchModules)) {
      const parts = filePath.split('/')
      // filePath: /students/<studentName>/<filename>.js
      const studentName = parts[2]
      if (!filesByFolder[studentName]) filesByFolder[studentName] = []
      filesByFolder[studentName].push({ filePath, code, studentName })
    }

    const studentFolders = shuffle(Object.keys(filesByFolder))
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

    let keyIdx = 0
    let boundCount = 0

    // Assign sketches from student folders to a-z
    for (const folder of studentFolders) {
      const sketches = filesByFolder[folder]
      for (const item of sketches) {
        if (keyIdx >= alphabet.length) break
        const keyChar = alphabet[keyIdx]
        const instance = compileSketch(item.code, p, item)
        if (instance) {
          keyBindings[keyChar] = {
            instance,
            studentName: item.studentName,
            filePath: item.filePath,
            active: false,
          }
          boundCount++
        }
        keyIdx++
      }
      if (keyIdx >= alphabet.length) break
    }

    // Update status element
    const statusEl = document.getElementById('status')
    if (statusEl) {
      const summary = Object.entries(keyBindings)
        .map(([k, v]) => `${k.toUpperCase()}: ${v.studentName}`)
        .join(' | ')
      statusEl.textContent = summary || 'No sketches found'
    }
  }

  p.draw = () => {
    p.background(17)

    // Render all active sketches
    for (const [keyChar, binding] of Object.entries(keyBindings)) {
      if (!binding.active) continue
      const inst = binding.instance
      let prog = 0
      if (typeof inst.progress === 'function') {
        prog = inst.progress()
      } else {
        // Fallback: duration = 1000ms
        const elapsed = p.millis() - inst.getStartTime()
        prog = p.constrain(elapsed / 1000, 0, 1)
      }

      if (prog > 0 && prog < 1) {
        p.push()
        try {
          if (inst.draw) inst.draw()
        } catch (e) {
          console.error(`Error in draw() for key [${keyChar}]:`, e)
        }
        p.pop()
      } else {
        binding.active = false
      }
    }
  }

  p.keyPressed = () => {
    if (window.userStartAudio) {
      window.userStartAudio()
    }
    const pressed = p.key ? p.key.toLowerCase() : ''
    const binding = keyBindings[pressed]
    if (binding) {
      binding.active = true
      // Trigger setup once on key hit to reset animation & start sounds
      if (binding.instance.setup) {
        try {
          binding.instance.setup()
        } catch (e) {
          console.error(`Error in setup() for key [${pressed}]:`, e)
        }
      }
      // Ensure startTime is synchronized to current time
      binding.instance.setStartTime(p.millis())
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
})
