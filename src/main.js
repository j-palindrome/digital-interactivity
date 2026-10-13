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

function compileSketch(codeString, meta) {
  try {
    return new Function(`
      ${codeString}
      return {
        setup: typeof setup === 'function' ? setup : null,
        draw: typeof draw === 'function' ? draw : null,
        progress: typeof progress === 'function' ? progress : null,
        setStartTime: (t) => { if (typeof startTime !== 'undefined') startTime = t },
      }
    `)()
  } catch (err) {
    console.error(`Error compiling sketch [${meta.filePath}]:`, err)
    return null
  }
}

// Map of alphabet key -> active sketch instance info
const keyBindings = {}
const studentKeyMap = {}

function randomFrom(array) {
  if (!Array.isArray(array) || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

function randomizeStudentKey(studentName = null) {
  const targetStudent = studentName || randomFrom(Object.keys(studentKeyMap))
  if (!targetStudent) return null

  const pool = studentKeyMap[targetStudent] || []
  const key = randomFrom(pool)
  if (!key) return null

  return {
    studentName: targetStudent,
    key,
    binding: keyBindings[key],
  }
}

function randomizePoolKey() {
  const pool = Object.keys(keyBindings)
  const key = randomFrom(pool)
  if (!key) return null

  return {
    studentName: keyBindings[key].studentName,
    key,
    binding: keyBindings[key],
  }
}

function assembleFullGridFromPool() {
  return shuffle(Object.keys(keyBindings)).map((key) => ({
    studentName: keyBindings[key].studentName,
    key,
    binding: keyBindings[key],
  }))
}

function triggerKey(char) {
  const binding = keyBindings[char?.toLowerCase()]
  if (!binding) return

  binding.active = true
  binding.startedAt = millis()
  try {
    binding.instance.setup?.()
    binding.instance.setStartTime(binding.startedAt)
  } catch (err) {
    binding.active = false
    console.error(`Error triggering sketch for key [${char}]:`, err)
  }
}

// p5 global mode supplies createCanvas, draw primitives, millis, key, etc.
window.setup = () => {
  createCanvas(windowWidth, windowHeight)
  background(17)

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

  // Assign sketches from student folders to a-z
  for (const folder of studentFolders) {
    for (const item of filesByFolder[folder]) {
      if (keyIdx >= alphabet.length) break
      const keyChar = alphabet[keyIdx++]
      const instance = compileSketch(item.code, item)
      if (instance) {
        keyBindings[keyChar] = {
          instance,
          studentName: item.studentName,
          filePath: item.filePath,
          active: false,
        }

        if (!studentKeyMap[item.studentName]) studentKeyMap[item.studentName] = []
        studentKeyMap[item.studentName].push(keyChar)
      }
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

  const randomStudentBtn = document.getElementById('random-student-key')
  const randomPoolBtn = document.getElementById('random-pool-key')

  randomStudentBtn?.addEventListener('click', () => {
    const selection = randomizeStudentKey()
    if (!selection) return
    triggerKey(selection.key)
    const statusEl = document.getElementById('status')
    if (statusEl) {
      statusEl.textContent = `Random student: ${selection.studentName} → ${selection.key.toUpperCase()}`
    }
  })

  randomPoolBtn?.addEventListener('click', () => {
    const selection = randomizePoolKey()
    if (!selection) return
    triggerKey(selection.key)
    const statusEl = document.getElementById('status')
    if (statusEl) {
      statusEl.textContent = `Random pool: ${selection.studentName} → ${selection.key.toUpperCase()}`
    }
  })
}

window.draw = () => {
  background(17)

  // Render only sketches activated by triggerKey().
  for (const [keyChar, binding] of Object.entries(keyBindings)) {
    if (!binding.active) continue
    const { instance } = binding
    const progress = instance.progress
      ? instance.progress()
      : constrain((millis() - binding.startedAt) / 1000, 0, 1)

    if (progress > 0 && progress < 1) {
      push()
      try {
        instance.draw?.()
      } catch (err) {
        console.error(`Error in draw() for key [${keyChar}]:`, err)
      }
      pop()
    } else {
      binding.active = false
    }
  }
}

window.keyPressed = () => {
  window.userStartAudio?.()
  triggerKey(key)
  return false
}

window.windowResized = () => resizeCanvas(windowWidth, windowHeight)
