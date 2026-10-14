let startTime = 0;
let duration = 1000;


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

async function setup() {
  let sound = await loadSound("chicken-on-tree-screaming.mp3");
  startTime = millis(); // simulates the key press (after load so audio and visuals line up)

  sound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // center the original 400x400 composition in the host canvas
    translate((width - 400) / 2, (height - 400) / 2);

    stroke(255);
    strokeWeight(5);

    let lineLength = currentProgress * 180;

    line(200, 200, 200 + lineLength, 200);
    line(200, 200, 200 - lineLength, 200);

    line(200, 200, 200, 200 + lineLength);
    line(200, 200, 200, 200 - lineLength);

    line(200, 200, 200 + lineLength, 200 + lineLength);
    line(200, 200, 200 - lineLength, 200 - lineLength);

    line(200, 200, 200 + lineLength, 200 - lineLength);
    line(200, 200, 200 - lineLength, 200 + lineLength);
  }
}
