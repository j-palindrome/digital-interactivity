/**
 * src/main.js — Vite vanilla JS entry point
 * Loads student sketches as raw source text, compiles each into an isolated
 * setup()/draw() execution context, and binds randomized folders to A-Z keys.
 */

// 1. Import all student sketch files as raw text strings
const sketchModules = import.meta.glob([
  '/students/**/*.js',
  '!/students/**/p5*.js',
  '!/students/**/{preload,data,shapes}.js',
], {
  query: '?raw',
  import: 'default',
})

const soundModules = import.meta.glob('/students/**/*.{mp3,wav,ogg,m4a,aac,webm}', {
  query: '?url',
  import: 'default',
  eager: true,
})

const soundAssetByPath = Object.fromEntries(
  Object.entries(soundModules).map(([path, url]) => [path.replace(/\\/g, '/'), url]),
)

function resolveSoundPaths(code, filePath) {
  const sketchDir = filePath.slice(0, filePath.lastIndexOf('/'))

  return code.replace(
    /(\bloadSound\s*\(\s*)(['"])([^'"]+)\2/g,
    (match, prefix, quote, soundPath) => {
      if (/^(?:https?:|data:|blob:|\/)/i.test(soundPath)) return match

      const relativePath = soundPath.replace(/\\/g, '/').replace(/^\.\//, '')
      const candidates = [
        `${sketchDir}/${relativePath}`,
        `/students/${relativePath}`,
      ].map((path) => path.replace(/\/+/g, '/'))

      const assetUrl = candidates
        .map((path) => soundAssetByPath[path])
        .find(Boolean)

      return assetUrl ? `${prefix}${JSON.stringify(assetUrl)}` : match
    },
  )
}

function loadSoundForSketch(path, onLoad, onError) {
  const p5LoadSound = window.loadSound
  if (typeof p5LoadSound !== 'function') {
    return Promise.reject(new Error('p5.sound loadSound() is unavailable'))
  }

  if (typeof onLoad === 'function' || typeof onError === 'function') {
    return p5LoadSound(path, onLoad, onError)
  }

  return new Promise((resolve, reject) => {
    let settled = false
    const resolveOnce = (sound) => {
      if (settled) return
      settled = true
      resolve(sound)
    }
    const rejectOnce = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }

    try {
      const result = p5LoadSound(path, resolveOnce, rejectOnce)
      if (result && typeof result.then === 'function') {
        result.then(resolveOnce, rejectOnce)
      }
    } catch (error) {
      rejectOnce(error)
    }
  })
}

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
    const source = resolveSoundPaths(codeString, meta.filePath)

    return new Function('loadSound', `
      ${source}
      return {
        setup: typeof setup === 'function' ? setup : null,
        draw: typeof draw === 'function' ? draw : null,
        keyPressed: typeof keyPressed === 'function' ? keyPressed : null,
        progress: typeof progress === 'function' ? progress : null,
        setStartTime: (t) => { if (typeof startTime !== 'undefined') startTime = t },
      }
    `)(loadSoundForSketch)
  } catch (err) {
    console.error(`Error compiling sketch [${meta.filePath}]:`, err)
    return null
  }
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const keyBindings = {}
let sketchPool = []

function randomize() {
  for (const k of Object.keys(keyBindings)) delete keyBindings[k]

  let keyIdx = 0
  for (const item of shuffle(sketchPool)) {
    if (keyIdx >= ALPHABET.length) break
    const instance = compileSketch(item.code, item)
    if (!instance) continue
    keyBindings[ALPHABET[keyIdx++]] = { ...item, instance, active: false }
  }

  const summary = Object.entries(keyBindings)
    .map(([k, v]) => `${k.toUpperCase()}: ${v.studentName} (${v.sketchName})`)
    .join(' | ')
  setStatus(summary || 'No sketches found')
  console.log(`[sketches] randomized ${keyIdx} keys from pool of ${sketchPool.length}`)
}

async function triggerKey(char) {
  window.userStartAudio?.()
  const binding = keyBindings[char?.toLowerCase()]
  if (!binding) return

  binding.active = false
  try {
    await binding.instance.setup?.()
    binding.startedAt = millis()
    binding.instance.setStartTime(binding.startedAt)

    const originalKey = binding.sketchName.match(/(?:^|key[_-]?)([a-z])$/i)?.[1]
    if (originalKey) {
      const previousKey = window.key
      window.key = originalKey.toLowerCase()
      try {
        binding.instance.keyPressed?.()
      } finally {
        window.key = previousKey
      }
    }

    binding.active = true
  } catch (err) {
    binding.active = false
    console.error(`Error starting sketch for key [${char}]:`, err)
  }
}

function setStatus(text) {
  const statusEl = document.getElementById('status')
  if (statusEl) statusEl.textContent = text
}

async function loadSketchSources() {
  const entries = Object.entries(sketchModules)
  const total = entries.length
  let done = 0
  console.log(`[sketches] loading ${total} files`)
  setStatus(`Loading 0% (0/${total})`)

  const loaded = await Promise.all(entries.map(async ([filePath, load]) => {
    let code = null
    try {
      code = await load()
    } catch (err) {
      console.error(`[sketches] failed ${filePath}:`, err)
    }
    done++
    const pct = Math.round((done / total) * 100)
    console.log(`[sketches] ${pct}% (${done}/${total}) ${filePath}`)
    setStatus(`Loading ${pct}% (${done}/${total}) — ${filePath.replace('/students/', '')}`)
    return [filePath, code]
  }))

  console.log(`[sketches] done: ${loaded.filter(([, c]) => c != null).length}/${total} loaded`)
  return loaded.filter(([, code]) => code != null)
}

// p5 global mode supplies createCanvas, draw primitives, millis, key, etc.
window.setup = () => {
  createCanvas(windowWidth, windowHeight)
  background(17)
  loadSketchSources().then(bindSketches)
}

function bindSketches(sources) {
  sketchPool = sources.map(([filePath, code]) => {
    // filePath pattern: /students/<studentName>/.../<filename>.js
    const parts = filePath.split('/')
    const fileName = parts[parts.length - 1]
    return {
      filePath,
      code,
      studentName: parts[2],
      sketchName: parts.length > 4 ? parts[parts.length - 2] : fileName.replace(/\.js$/, ''),
    }
  })

  randomize()
  document.getElementById('randomize')?.addEventListener('click', randomize)
}
