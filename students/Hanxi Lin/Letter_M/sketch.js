
let startTime = 0;
let duration = 1000;

let boo;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
    return middleLevel +
      (endLevel - middleLevel) *
      easeQuad((p - (1 - fadeOut)) / fadeOut);
  }

  return middleLevel;
}

function setup() {
  createCanvas(400, 400);
  strokeCap(ROUND);

  boo = new Audio("boo.mp3");
  boo.volume = 0.3;

  startTime = millis();

  // Start sound with the animation
  boo.play().catch(error => {
    console.error("Could not play boo.mp3:", error);
  });
}

function draw() {
  background(15);

  let currentProgress = progress();
  let pop = easeQuad(currentProgress);

  let cx = width / 2;
  let cy = height / 2;
  let radius = 110;

  let vertices = [];

  for (let i = 0; i < 6; i++) {
    let angle = -PI / 2 + i * TWO_PI / 6;
    let r = radius * pop;

    let x = cx + cos(angle) * r;
    let y = cy + sin(angle) * r;

    vertices.push({ x: x, y: y });
  }

  stroke(255);
  strokeWeight(3);
  noFill();

  beginShape();
  for (let v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  noStroke();
  fill(255);

  for (let v of vertices) {
    circle(v.x, v.y, 12);
  }

  // Restart sound and animation together
  if (currentProgress >= 1) {
    boo.pause();
    boo.currentTime = 0;

    startTime = millis();

    boo.play().catch(error => {
      console.error("Could not replay boo.mp3:", error);
    });
  }
}
