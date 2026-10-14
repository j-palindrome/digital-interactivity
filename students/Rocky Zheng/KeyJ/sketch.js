let startTime = 0;
let duration = 1000;

let circles = [];

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
  let sound = await loadSound("roblox-death-sound_1.mp3");
  startTime = millis(); // simulates the key press (after load so audio and visuals line up)

  circles = [];

  for (let i = 0; i < 7; i++) {
    circles.push({
      x: random(30, 370),
      y: random(30, 370),
      size: random(15, 35)
    });
  }

  sound.play();
}

function draw() {
  let currentProgress = progress();

  if (currentProgress > 0 && currentProgress < 1) {
    // center the original 400x400 composition in the host canvas
    translate((width - 400) / 2, (height - 400) / 2);

    noStroke();
    fill(255);

    for (let i = 0; i < circles.length; i++) {
      circle(
        circles[i].x,
        circles[i].y,
        circles[i].size
      );
    }
  }
}
