let startTime = 0;
let duration = 600; // 0.6-second wave animation

// Animation progress
function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(
  p,
  { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }
) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;

  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;

    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }

  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;

    return (
      middleLevel +
      (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut)
    );
  }

  return middleLevel;
}

// Start wave and sound (was: press K)
async function setup() {
  let waveSound = await loadSound("wave.mp3");
  startTime = millis(); // simulates the key press

  waveSound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // Wave grows and fades
    let waveAmplitude =
      40 *
      envelope(currentProgress, {
        fadeIn: 0.25,
        fadeOut: 0.35,
        startLevel: 0,
        middleLevel: 1,
        endLevel: 0,
      });

    // Wave moves from left to right
    let waveFront = currentProgress * width;

    noFill();
    stroke(120, 230, 200);
    strokeWeight(4);

    beginShape();

    for (let x = 0; x <= waveFront; x += 4) {
      let y = height / 2 + sin(x * 0.05 + millis() * 0.005) * waveAmplitude;

      vertex(x, y);
    }

    endShape();
  }
}
