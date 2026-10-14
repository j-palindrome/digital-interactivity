
let oscC;
let oscF;
let oscG;
let oscH;

let selectedKey = "";
let message = "A-fireworks,B-elevator music, C, E for brids chripping,F, G, or H";
let bgColor = [255, 220, 235];

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);

  // Create oscillator sounds
  oscC = new p5.Oscillator("triangle");
  oscF = new p5.Oscillator("sine");
  oscG = new p5.Oscillator("square");
  oscH = new p5.Oscillator("sawtooth");

  // Give each oscillator a different pitch
  oscC.freq(330);
  oscF.freq(440);
  oscG.freq(550);
  oscH.freq(660);

  // Start each oscillator silently
  oscC.amp(0);
  oscF.amp(0);
  oscG.amp(0);
  oscH.amp(0);

  oscC.start();
  oscF.start();
  oscG.start();
  oscH.start();
}

function draw() {
  background(bgColor);

  fill(0);
  noStroke();
  textSize(14);
  text(message, width / 2, 30);

  // A: Arc
  if (selectedKey === "a") {
    noFill();
    stroke(255, 50, 120);
    strokeWeight(5);
    arc(200, 220, 150, 150, 0, PI + QUARTER_PI);
  }

  // B: Polygon
  else if (selectedKey === "b") {
    fill(100, 150, 255);
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(200, 120);
    vertex(280, 200);
    vertex(240, 290);
    vertex(150, 270);
    vertex(120, 180);
    endShape(CLOSE);
  }

  // C: Bezier curve
  else if (selectedKey === "c") {
    noFill();
    stroke(180, 50, 200);
    strokeWeight(5);
    bezier(60, 250, 100, 80, 300, 350, 340, 150);
  }

  // E: Circle
  else if (selectedKey === "e") {
    noStroke();
    fill(100, 200, 150);
    circle(200, 220, 150);
  }

  // F: Ellipse
  else if (selectedKey === "f") {
    noStroke();
    fill(255, 180, 50);
    ellipse(200, 220, 230, 120);
  }

  // G: Lines
  else if (selectedKey === "g") {
    stroke(255, 100, 50);
    strokeWeight(5);
    line(100, 150, 300, 280);
    line(300, 150, 100, 280);
    line(200, 120, 200, 300);
  }

  // H: Points
  else if (selectedKey === "h") {
    stroke(100, 50, 200);
    strokeWeight(10);
    point(150, 180);
    point(200, 150);
    point(250, 180);
    point(170, 240);
    point(230, 240);
  }
}

// Stop oscillator sounds when changing keys
function stopOscillators() {
  oscC.amp(0, 0.05);
  oscF.amp(0, 0.05);
  oscG.amp(0, 0.05);
  oscH.amp(0, 0.05);
}

function keyPressed() {
  let pressed = key.toLowerCase();

  if ("abcefgh".includes(pressed) && pressed.length === 1) {
    selectedKey = pressed;
    message = pressed.toUpperCase() + ": Drawing";

    stopOscillators();

    // A: Pink background
    if (pressed === "a") {
      bgColor = [255, 220, 235];
    }

    // B: Blue background
    else if (pressed === "b") {
      bgColor = [200, 220, 255];
    }

    // C: Triangle wave
    else if (pressed === "c") {
      bgColor = [255, 150, 200];
      oscC.amp(0.2, 0.05);
    }

    // E: Green background
    else if (pressed === "e") {
      bgColor = [210, 255, 220];
    }

    // F: Sine wave
    else if (pressed === "f") {
      bgColor = [255, 230, 170];
      oscF.amp(0.2, 0.05);
    }

    // G: Square wave
    else if (pressed === "g") {
      bgColor = [255, 200, 180];
      oscG.amp(0.2, 0.05);
    }

    // H: Sawtooth wave
    else if (pressed === "h") {
      bgColor = [220, 200, 255];
      oscH.amp(0.2, 0.05);
    }
  }
}
