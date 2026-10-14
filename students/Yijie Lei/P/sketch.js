let startTime = 0;
let duration = 3000;
let osc;

function progress() {
  return constrain((millis() - startTime) / duration, 0, 1);
}

function easeQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function envelope(p, { fadeIn, fadeOut, startLevel = 0, middleLevel = 1, endLevel = 0 }) {
  if (p <= 0) return startLevel;
  if (p >= 1) return endLevel;
  if (p < fadeIn) {
    if (fadeIn <= 0) return middleLevel;
    return startLevel + (middleLevel - startLevel) * easeQuad(p / fadeIn);
  }
  if (p > 1 - fadeOut) {
    if (fadeOut <= 0) return middleLevel;
    return middleLevel + (endLevel - middleLevel) * easeQuad((p - (1 - fadeOut)) / fadeOut);
  }
  return middleLevel;
}

function setup() {
  startTime = millis(); // simulate keypress
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.freq(1000);
  osc.start();
  osc.stop(duration / 1000);
}

function draw() {
  let p = progress();

  if (p > 0 && p < 1) {
    noStroke();
    let colW = width / 7;

    let topColors = [
      color(192, 192, 192), color(192, 192, 0), color(0, 192, 192),
      color(0, 192, 0), color(192, 0, 192), color(192, 0, 0), color(0, 0, 192)
    ];
    for (let i = 0; i < 7; i++) {
      fill(topColors[i]);
      rect(i * colW, 0, colW, height * 0.67);
    }

    let midColors = [
      color(0, 0, 192), color(19, 19, 19), color(192, 0, 192),
      color(19, 19, 19), color(0, 192, 192), color(19, 19, 19), color(192, 192, 192)
    ];
    for (let i = 0; i < 7; i++) {
      fill(midColors[i]);
      rect(i * colW, height * 0.67, colW, height * 0.08);
    }

    let y3 = height * 0.75;
    let h3 = height * 0.25;

    fill(0, 33, 76);
    rect(0, y3, colW * 1.25, h3);
    
    fill(255);
    rect(colW * 1.25, y3, colW * 1.25, h3);
    
    fill(50, 0, 106);
    rect(colW * 2.5, y3, colW * 1.25, h3);
    
    fill(19);
    rect(colW * 3.75, y3, width, h3);

    fill(0);
    rect(colW * 5.0, y3, colW * 0.25, h3);
    
    fill(19);
    rect(colW * 5.25, y3, colW * 0.25, h3);
    
    fill(38);
    rect(colW * 5.5, y3, colW * 0.25, h3);

    let envValue = envelope(p, {
      fadeIn: 0.1,
      fadeOut: 0.1,
      startLevel: 0,
      middleLevel: 1,
      endLevel: 0
    });

    osc.amp(envValue * 0.3, 0.05);
    osc.freq(1000);
  }
}

